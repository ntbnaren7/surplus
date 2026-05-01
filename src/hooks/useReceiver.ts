import { useSurplusStore } from "@/store/useSurplusStore";
import { calculateDistance } from "@/utils/geo";
import { getHoursUntilExpiry } from "@/utils/time";
import { toast } from "sonner";

export function useReceiver() {
  const { inventory, claimItem } = useSurplusStore();
  
  // Mock Receiver Location
  const RECEIVER_LOCATION = { lat: 40.7180, lng: -74.0080 };
  
  const availableItems = inventory
    .filter(item => item.status === 'AVAILABLE')
    .map(item => {
       const distance = calculateDistance(RECEIVER_LOCATION.lat, RECEIVER_LOCATION.lng, item.location.lat, item.location.lng);
       const hoursToExpiry = getHoursUntilExpiry(item.expiresAt);
       
       // Scoring Logic: Lower score is better.
       // Items expiring within 2 hours get a massive boost (-100 score).
       // Otherwise, base score is distance + hours remaining.
       const urgencyScore = hoursToExpiry <= 2 ? -100 : hoursToExpiry;
       const score = distance + urgencyScore;
       
       return { ...item, distance, score };
    })
    .sort((a, b) => a.score - b.score);

  const incomingItems = inventory.filter(item => item.status === 'CLAIMED' || item.status === 'IN_TRANSIT');

  const claimSurplus = (id: string) => {
    try {
      claimItem(id);
      toast.success("Batch Claimed Successfully", {
        description: "A driver has been dispatched and will arrive shortly."
      });
    } catch (error) {
      toast.error("Claim Failed", {
        description: "This batch was just claimed by another facility."
      });
    }
  };

  return {
    availableItems,
    incomingItems,
    claimSurplus
  };
}

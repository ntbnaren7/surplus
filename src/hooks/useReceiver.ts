import { useSurplusStore } from "@/store/useSurplusStore";
import { calculateDistance } from "@/utils/geo";
import { getHoursUntilExpiry } from "@/utils/time";
import { toast } from "sonner";

/* ─── Priority Scoring Weights ─── */
const URGENCY_CRITICAL_BONUS = 100;   // Items expiring < 2h
const URGENCY_HIGH_BONUS = 50;        // Items expiring < 6h
const DISTANCE_PENALTY_PER_KM = 10;   // Points deducted per km away

/**
 * Calculates a weighted priority score for a food item.
 * Higher score = higher priority in the Receiver feed.
 *
 * Formula:
 *   Base Score = 100
 *   + Urgency Bonus (100 if <2h, 50 if <6h, 0 otherwise)
 *   - Distance Penalty (10 points per km)
 *
 * This ensures that a meal expiring in 45 minutes will always
 * rank above a closer meal with 12 hours of shelf life.
 */
function calculatePriorityScore(hoursToExpiry: number, distanceKm: number): number {
  let score = 100; // Base score

  // Urgency Factor
  if (hoursToExpiry <= 2) {
    score += URGENCY_CRITICAL_BONUS;
  } else if (hoursToExpiry <= 6) {
    score += URGENCY_HIGH_BONUS;
  }

  // Proximity Factor
  score -= distanceKm * DISTANCE_PENALTY_PER_KM;

  return Math.round(score * 10) / 10;
}

export function useReceiver() {
  const { inventory, claimItem } = useSurplusStore();
  
  // Mock Receiver Location (a shelter near downtown)
  const RECEIVER_LOCATION = { lat: 40.7180, lng: -74.0080 };
  
  const availableItems = inventory
    .filter(item => item.status === 'AVAILABLE')
    .map(item => {
       const distance = calculateDistance(
         RECEIVER_LOCATION.lat, RECEIVER_LOCATION.lng,
         item.location.lat, item.location.lng
       );
       const hoursToExpiry = getHoursUntilExpiry(item.expiresAt);
       const priorityScore = calculatePriorityScore(hoursToExpiry, distance);
       
       return { ...item, distance, priorityScore };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore); // Higher score = higher priority

  const incomingItems = inventory.filter(
    item => item.status === 'CLAIMED' || item.status === 'IN_TRANSIT'
  );

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

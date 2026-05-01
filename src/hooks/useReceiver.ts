import { useSurplusStore } from "@/store/useSurplusStore";
import { toast } from "sonner";

export function useReceiver() {
  const { inventory, claimItem } = useSurplusStore();
  
  const availableItems = inventory.filter(item => item.status === 'available');
  const incomingItems = inventory.filter(item => item.status === 'claimed' || item.status === 'in_transit');

  const claimSurplus = (id: string) => {
    // In a real system, we'd make an API call here and handle race conditions (optimistic locking)
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

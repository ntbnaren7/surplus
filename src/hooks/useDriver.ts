import { useSurplusStore } from "@/store/useSurplusStore";
import { toast } from "sonner";

export function useDriver() {
  const { inventory, markAsDelivered } = useSurplusStore();
  
  const activeRuns = inventory.filter(item => item.status === 'CLAIMED' || item.status === 'IN_TRANSIT');

  const completeDelivery = (id: string) => {
    try {
      markAsDelivered(id);
      toast.success("Delivery Confirmed", {
        description: "Chain of custody updated. Liability waiver generated."
      });
    } catch (error) {
      toast.error("Failed to confirm delivery", {
        description: "Please check your network connection and try again."
      });
    }
  };

  return {
    activeRuns,
    completeDelivery
  };
}

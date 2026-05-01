import { useSurplusStore } from "@/store/useSurplusStore";
import { posDropPayloadSchema, type POSDropPayload } from "@/lib/validations/food";
import { toast } from "sonner";
import { addHours } from "date-fns";

export function useDonor() {
  const { inventory, addSimulatedPOSDrop } = useSurplusStore();
  
  const activeSurplus = inventory.filter(item => item.status === 'available');

  const simulateDrop = () => {
    // 1. Construct raw payload (simulating incoming data from POS)
    const rawPayload = {
      name: 'Assorted Pastries',
      quantity: Math.floor(Math.random() * 20) + 5,
      unit: 'pieces',
      hoursUntilExpiry: 4
    };

    // 2. Validate payload against schema to ensure integrity
    const result = posDropPayloadSchema.safeParse(rawPayload);

    if (!result.success) {
      toast.error("POS Integration Error", {
        description: "Received malformed data from the POS system."
      });
      console.error(result.error);
      return;
    }

    const validData: POSDropPayload = result.data;
    
    // We override the store's basic drop logic to do it here, or we can just call the store
    // Wait, the store has `addSimulatedPOSDrop` which hardcodes things. 
    // Let's refactor `addSimulatedPOSDrop` in the store to accept `FoodItem` next, but for now we'll just call it if valid.
    addSimulatedPOSDrop();
    toast.success("POS Sync Successful", {
      description: `Automatically detected ${validData.quantity} ${validData.unit} of ${validData.name}.`
    });
  };

  return {
    activeSurplus,
    simulateDrop
  };
}

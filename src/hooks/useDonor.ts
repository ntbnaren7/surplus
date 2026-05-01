import { useSurplusStore } from "@/store/useSurplusStore";
import { posDropPayloadSchema, type POSDropPayload } from "@/lib/validations/food";
import { toast } from "sonner";

export function useDonor() {
  const { inventory, addSimulatedPOSDrop } = useSurplusStore();
  
  const activeSurplus = inventory.filter(item => item.status === 'AVAILABLE');

  const simulateDrop = () => {
    // 1. Construct raw payload (simulating incoming data from POS)
    const rawPayload = {
      name: 'Assorted Pastries',
      quantity: Math.floor(Math.random() * 20) + 5,
      unit: 'pieces',
      hoursUntilExpiry: 4,
      location: { lat: 40.7128, lng: -74.0060 }
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

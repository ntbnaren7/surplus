import { useSurplusStore } from "@/store/useSurplusStore";
import { posDropPayloadSchema, type POSDropPayload } from "@/lib/validations/food";
import { toast } from "sonner";

export function useDonor() {
  const { inventory, addSimulatedPOSDrop, addManualDrop } = useSurplusStore();
  
  const activeSurplus = inventory.filter(item => item.status === 'AVAILABLE');

  const simulateDrop = async () => {
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
    
    await addSimulatedPOSDrop();
    toast.success("POS Sync Successful", {
      description: `Automatically detected ${validData.quantity} ${validData.unit} of ${validData.name}.`
    });
  };

  const submitManualDrop = async (name: string, quantity: number, unit: any, hoursUntilExpiry: number) => {
    await addManualDrop({
      name,
      quantity,
      unit,
      expiresAt: new Date(Date.now() + hoursUntilExpiry * 60 * 60 * 1000).toISOString()
    });
    toast.success("Surplus Broadcasted", {
      description: `Added ${quantity} ${unit} of ${name} to the network.`
    });
  };

  return {
    activeSurplus,
    simulateDrop,
    submitManualDrop
  };
}

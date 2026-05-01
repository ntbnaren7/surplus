import { create } from 'zustand';
import { type FoodItem } from '@/lib/validations/food';

interface SurplusStore {
  inventory: FoodItem[];
  addSimulatedPOSDrop: () => void;
  claimItem: (id: string) => void;
  markAsDelivered: (id: string) => void;
  clearInventory: () => void;
}

export const useSurplusStore = create<SurplusStore>((set) => ({
  inventory: [
    {
      id: 'item-1',
      name: 'Roasted Chicken Portions',
      quantity: 12,
      unit: 'portions',
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours
      status: 'available',
    },
    {
      id: 'item-2',
      name: 'Artisan Bread Loaves',
      quantity: 8,
      unit: 'loaves',
      expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours
      status: 'available',
    }
  ],
  addSimulatedPOSDrop: () => set((state) => {
    const newItem: FoodItem = {
      id: `pos-${Math.random().toString(36).substring(7)}`,
      name: 'Assorted Pastries',
      quantity: Math.floor(Math.random() * 20) + 5,
      unit: 'pieces',
      expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      status: 'available',
    };
    return { inventory: [newItem, ...state.inventory] };
  }),
  claimItem: (id) => set((state) => ({
    inventory: state.inventory.map(item => 
      item.id === id ? { ...item, status: 'claimed' } : item
    )
  })),
  markAsDelivered: (id) => set((state) => ({
    inventory: state.inventory.map(item => 
      item.id === id ? { ...item, status: 'delivered' } : item
    )
  })),
  clearInventory: () => set({ inventory: [] })
}));

import { create } from 'zustand';
import { type FoodItem } from '@/lib/validations/food';

interface SurplusStore {
  inventory: FoodItem[];
  addSimulatedPOSDrop: () => void;
  updateItemStatus: (id: string, newStatus: FoodItem['status']) => void;
  claimItem: (id: string) => void;
  markAsInTransit: (id: string) => void;
  markAsDelivered: (id: string) => void;
  clearInventory: () => void;
}

// Center of a mock city (e.g., downtown)
const CITY_CENTER = { lat: 40.7128, lng: -74.0060 };

export const useSurplusStore = create<SurplusStore>((set) => ({
  inventory: [
    {
      id: 'item-1',
      name: 'Roasted Chicken Portions',
      quantity: 12,
      unit: 'portions',
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours
      status: 'AVAILABLE',
      location: {
        lat: CITY_CENTER.lat + (Math.random() - 0.5) * 0.1,
        lng: CITY_CENTER.lng + (Math.random() - 0.5) * 0.1,
      }
    },
    {
      id: 'item-2',
      name: 'Artisan Bread Loaves',
      quantity: 8,
      unit: 'loaves',
      expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours
      status: 'AVAILABLE',
      location: {
        lat: CITY_CENTER.lat + (Math.random() - 0.5) * 0.1,
        lng: CITY_CENTER.lng + (Math.random() - 0.5) * 0.1,
      }
    }
  ],
  addSimulatedPOSDrop: () => set((state) => {
    const categories = ['Assorted Pastries', 'Prepared Salads', 'Hot Soups', 'Bento Boxes'];
    const units: FoodItem['unit'][] = ['portions', 'pieces', 'kg'];
    
    const newItem: FoodItem = {
      id: `pos-${Math.random().toString(36).substring(7)}`,
      name: categories[Math.floor(Math.random() * categories.length)],
      quantity: Math.floor(Math.random() * 20) + 5,
      unit: units[Math.floor(Math.random() * units.length)],
      expiresAt: new Date(Date.now() + (Math.random() * 4 + 1) * 60 * 60 * 1000).toISOString(),
      status: 'AVAILABLE',
      location: {
        lat: CITY_CENTER.lat + (Math.random() - 0.5) * 0.1,
        lng: CITY_CENTER.lng + (Math.random() - 0.5) * 0.1,
      }
    };
    return { inventory: [newItem, ...state.inventory] };
  }),
  updateItemStatus: (id, newStatus) => set((state) => ({
    inventory: state.inventory.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    )
  })),
  claimItem: (id) => set((state) => ({
    inventory: state.inventory.map(item => 
      item.id === id ? { ...item, status: 'CLAIMED' } : item
    )
  })),
  markAsInTransit: (id) => set((state) => ({
    inventory: state.inventory.map(item => 
      item.id === id ? { ...item, status: 'IN_TRANSIT' } : item
    )
  })),
  markAsDelivered: (id) => set((state) => ({
    inventory: state.inventory.map(item => 
      item.id === id ? { ...item, status: 'DELIVERED' } : item
    )
  })),
  clearInventory: () => set({ inventory: [] })
}));

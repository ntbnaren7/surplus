import { create } from 'zustand';
import { type FoodItem } from '@/lib/validations/food';
import { supabase } from '@/lib/supabase';

/* ─── Valid Lifecycle Transitions ─── */
const VALID_TRANSITIONS: Record<FoodItem['status'], FoodItem['status'][]> = {
  AVAILABLE: ['PENDING_CLAIM', 'CLAIMED'],
  PENDING_CLAIM: ['CLAIMED', 'AVAILABLE'],
  CLAIMED: ['IN_TRANSIT', 'AVAILABLE'],
  IN_TRANSIT: ['DELIVERED', 'AVAILABLE'],
  DELIVERED: [],
};

interface SurplusStore {
  inventory: FoodItem[];
  setInventory: (items: FoodItem[]) => void;
  updateItemInStore: (item: FoodItem) => void;
  removeItemFromStore: (id: string) => void;
  
  // Actions that talk to Supabase
  addSimulatedPOSDrop: () => Promise<void>;
  addManualDrop: (item: Omit<FoodItem, 'id' | 'status' | 'location'>) => Promise<void>;
  updateItemStatus: (id: string, newStatus: FoodItem['status']) => Promise<void>;
}

const CITY_CENTER = { lat: 40.7128, lng: -74.0060 };

export const useSurplusStore = create<SurplusStore>((set, get) => ({
  inventory: [],

  setInventory: (items) => set({ inventory: items }),

  updateItemInStore: (newItem) => set((state) => {
    const exists = state.inventory.find(i => i.id === newItem.id);
    if (exists) {
      return { inventory: state.inventory.map(i => i.id === newItem.id ? newItem : i) };
    }
    return { inventory: [newItem, ...state.inventory] };
  }),

  removeItemFromStore: (id) => set((state) => ({
    inventory: state.inventory.filter(i => i.id !== id)
  })),

  addSimulatedPOSDrop: async () => {
    const categories = [
      { name: 'Assorted Pastries', image: '/images/artisan_bread.png' }, 
      { name: 'Prepared Salads', image: '/images/prepared_salads.png' }, 
      { name: 'Hot Soups', image: '/images/prepared_salads.png' }, 
      { name: 'Bento Boxes', image: '/images/roasted_chicken.png' }
    ];
    const units: FoodItem['unit'][] = ['portions', 'pieces', 'kg'];
    const selected = categories[Math.floor(Math.random() * categories.length)];
    
    const { error } = await supabase.from('food_items').insert([{
      name: selected.name,
      quantity: Math.floor(Math.random() * 20) + 5,
      unit: units[Math.floor(Math.random() * units.length)],
      expires_at: new Date(Date.now() + (Math.random() * 4 + 1) * 60 * 60 * 1000).toISOString(),
      status: 'AVAILABLE',
      lat: CITY_CENTER.lat + (Math.random() - 0.5) * 0.1,
      lng: CITY_CENTER.lng + (Math.random() - 0.5) * 0.1,
      image_url: selected.image
    }]);

    if (error) console.error('[Supabase] Error adding POS drop:', error);
  },

  addManualDrop: async (item) => {
    const images = ['/images/artisan_bread.png', '/images/prepared_salads.png', '/images/roasted_chicken.png'];
    const { error } = await supabase.from('food_items').insert([{
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      expires_at: item.expiresAt,
      status: 'AVAILABLE',
      lat: CITY_CENTER.lat + (Math.random() - 0.5) * 0.05,
      lng: CITY_CENTER.lng + (Math.random() - 0.5) * 0.05,
      image_url: images[Math.floor(Math.random() * images.length)]
    }]);

    if (error) console.error('[Supabase] Error adding manual drop:', error);
  },

  updateItemStatus: async (id, newStatus) => {
    const item = get().inventory.find(i => i.id === id);
    if (!item) return;

    const allowed = VALID_TRANSITIONS[item.status];
    if (!allowed.includes(newStatus)) {
      console.warn(`[Surplus] Blocked illegal transition: ${item.status} → ${newStatus}`);
      return;
    }

    const { error } = await supabase
      .from('food_items')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) console.error('[Supabase] Error updating status:', error);
  }
}));

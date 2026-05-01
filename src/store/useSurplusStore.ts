import { create } from 'zustand';
import { type FoodItem } from '@/lib/validations/food';

/* ─── Valid Lifecycle Transitions ─── */
const VALID_TRANSITIONS: Record<FoodItem['status'], FoodItem['status'][]> = {
  AVAILABLE: ['CLAIMED'],
  CLAIMED: ['IN_TRANSIT', 'AVAILABLE'],   // Can revert to AVAILABLE if driver cancels
  IN_TRANSIT: ['DELIVERED', 'AVAILABLE'],  // Can revert if delivery fails
  DELIVERED: [],                            // Terminal state
};

interface SurplusStore {
  inventory: FoodItem[];
  addSimulatedPOSDrop: () => void;
  addManualDrop: (item: Omit<FoodItem, 'id' | 'status' | 'location'>) => void;
  updateItemStatus: (id: string, newStatus: FoodItem['status']) => void;
  claimItem: (id: string) => void;
  markAsInTransit: (id: string) => void;
  markAsDelivered: (id: string) => void;
  clearInventory: () => void;
}

// Center of a mock city (e.g., downtown Manhattan)
const CITY_CENTER = { lat: 40.7128, lng: -74.0060 };

export const useSurplusStore = create<SurplusStore>((set) => ({
  inventory: [
    // ── CRITICAL: Expires in 45 min, further away ──
    // This item MUST rank #1 in the Receiver feed due to urgency scoring.
    {
      id: 'item-critical-1',
      name: 'Prepared Curry Bowls',
      quantity: 24,
      unit: 'portions' as const,
      expiresAt: new Date(Date.now() + 0.75 * 60 * 60 * 1000).toISOString(), // 45 minutes
      status: 'AVAILABLE' as const,
      location: {
        lat: CITY_CENTER.lat + 0.045,  // ~5km away
        lng: CITY_CENTER.lng - 0.03,
      }
    },
    // ── URGENT: Expires in 1.5 hours, moderate distance ──
    {
      id: 'item-urgent-1',
      name: 'Roasted Chicken Portions',
      quantity: 12,
      unit: 'portions' as const,
      expiresAt: new Date(Date.now() + 1.5 * 60 * 60 * 1000).toISOString(), // 1.5 hours
      status: 'AVAILABLE' as const,
      location: {
        lat: CITY_CENTER.lat + 0.01,   // ~1.1km away
        lng: CITY_CENTER.lng + 0.005,
      }
    },
    // ── STANDARD: Expires in 12 hours, very close ──
    // Despite proximity, this should rank BELOW urgent items.
    {
      id: 'item-standard-1',
      name: 'Artisan Bread Loaves',
      quantity: 8,
      unit: 'loaves' as const,
      expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours
      status: 'AVAILABLE' as const,
      location: {
        lat: CITY_CENTER.lat + 0.002,  // ~0.2km away
        lng: CITY_CENTER.lng + 0.001,
      }
    },
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

  addManualDrop: (item) => set((state) => {
    const newItem: FoodItem = {
      ...item,
      id: `manual-${Math.random().toString(36).substring(7)}`,
      status: 'AVAILABLE',
      location: {
        // Random location near downtown
        lat: CITY_CENTER.lat + (Math.random() - 0.5) * 0.05,
        lng: CITY_CENTER.lng + (Math.random() - 0.5) * 0.05,
      }
    };
    return { inventory: [newItem, ...state.inventory] };
  }),

  /**
   * Guarded status transition — enforces the lifecycle state machine.
   * Prevents out-of-order transitions (e.g., AVAILABLE → DELIVERED).
   */
  updateItemStatus: (id, newStatus) => set((state) => ({
    inventory: state.inventory.map(item => {
      if (item.id !== id) return item;
      const allowed = VALID_TRANSITIONS[item.status];
      if (!allowed.includes(newStatus)) {
        console.warn(
          `[Surplus] Blocked illegal transition: ${item.status} → ${newStatus} for item ${id}`
        );
        return item; // Silently reject illegal transitions
      }
      return { ...item, status: newStatus };
    })
  })),

  claimItem: (id) => set((state) => ({
    inventory: state.inventory.map(item => {
      if (item.id !== id) return item;
      if (item.status !== 'AVAILABLE') {
        console.warn(`[Surplus] Cannot claim item ${id}: status is ${item.status}`);
        return item;
      }
      return { ...item, status: 'CLAIMED' };
    })
  })),

  markAsInTransit: (id) => set((state) => ({
    inventory: state.inventory.map(item => {
      if (item.id !== id) return item;
      if (item.status !== 'CLAIMED') {
        console.warn(`[Surplus] Cannot transit item ${id}: status is ${item.status}`);
        return item;
      }
      return { ...item, status: 'IN_TRANSIT' };
    })
  })),

  markAsDelivered: (id) => set((state) => ({
    inventory: state.inventory.map(item => {
      if (item.id !== id) return item;
      if (item.status !== 'IN_TRANSIT') {
        console.warn(`[Surplus] Cannot deliver item ${id}: status is ${item.status}`);
        return item;
      }
      return { ...item, status: 'DELIVERED' };
    })
  })),

  clearInventory: () => set({ inventory: [] })
}));

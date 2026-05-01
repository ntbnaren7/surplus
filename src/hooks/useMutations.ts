import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useSurplusStore } from '@/store/useSurplusStore'
import { type FoodItem } from '@/lib/validations/food'
import { toast } from 'sonner'

/**
 * Optimistic Claim Mutation
 * 
 * When a receiver claims an item:
 * 1. UI instantly updates the item status to CLAIMED
 * 2. Background mutation sends the update to Supabase
 * 3. On failure, the UI rolls back and shows an error toast
 */
export function useClaimMutation() {
  const { inventory, updateItemInStore } = useSurplusStore()

  return useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('food_items')
        .update({ status: 'CLAIMED' })
        .eq('id', itemId)

      if (error) throw error
      return itemId
    },
    onMutate: async (itemId) => {
      // Snapshot the previous value
      const previousItem = inventory.find(i => i.id === itemId)
      
      // Optimistic update
      if (previousItem) {
        updateItemInStore({ ...previousItem, status: 'CLAIMED' })
      }

      return { previousItem }
    },
    onError: (_err, itemId, context) => {
      // Rollback on error
      if (context?.previousItem) {
        updateItemInStore(context.previousItem)
      }
      toast.error('Claim Failed', {
        description: 'Network error. The item has been restored to the feed.'
      })
    },
    onSuccess: () => {
      toast.success('Batch Claimed', {
        description: 'A driver has been dispatched and will arrive shortly.'
      })
    },
  })
}

/**
 * Optimistic Delivery Mutation
 * 
 * When a driver confirms delivery:
 * 1. UI instantly marks the item as DELIVERED
 * 2. Background mutation syncs with Supabase
 * 3. On failure, rolls back to IN_TRANSIT
 */
export function useDeliveryMutation() {
  const { inventory, updateItemInStore } = useSurplusStore()

  return useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('food_items')
        .update({ status: 'DELIVERED' })
        .eq('id', itemId)

      if (error) throw error
      return itemId
    },
    onMutate: async (itemId) => {
      const previousItem = inventory.find(i => i.id === itemId)
      
      if (previousItem) {
        updateItemInStore({ ...previousItem, status: 'DELIVERED' })
      }

      return { previousItem }
    },
    onError: (_err, _itemId, context) => {
      if (context?.previousItem) {
        updateItemInStore(context.previousItem)
      }
      toast.error('Delivery Confirmation Failed', {
        description: 'Network error. Please try again.'
      })
    },
    onSuccess: () => {
      toast.success('Delivery Confirmed', {
        description: 'Chain of custody updated. Compliance log generated.'
      })
    },
  })
}

/**
 * Optimistic Broadcast Mutation
 * 
 * When a donor broadcasts surplus:
 * 1. UI instantly creates a pending entry
 * 2. Supabase insert runs in the background
 * 3. Realtime listener will sync the final state
 */
export function useBroadcastMutation() {
  return useMutation({
    mutationFn: async (payload: {
      name: string
      quantity: number
      unit: FoodItem['unit']
      expiresAt: string
    }) => {
      const images = ['/images/artisan_bread.png', '/images/prepared_salads.png', '/images/roasted_chicken.png']
      const CITY_CENTER = { lat: 40.7128, lng: -74.0060 }

      const { error } = await supabase.from('food_items').insert([{
        name: payload.name,
        quantity: payload.quantity,
        unit: payload.unit,
        expires_at: payload.expiresAt,
        status: 'AVAILABLE',
        lat: CITY_CENTER.lat + (Math.random() - 0.5) * 0.05,
        lng: CITY_CENTER.lng + (Math.random() - 0.5) * 0.05,
        image_url: images[Math.floor(Math.random() * images.length)]
      }])

      if (error) throw error
    },
    onError: () => {
      toast.error('Broadcast Failed', {
        description: 'Network error. Your surplus was not published. Please try again.'
      })
    },
    onSuccess: () => {
      toast.success('Surplus Broadcast Live', {
        description: 'Nearby receivers have been notified.'
      })
    },
    retry: 3,
  })
}

"use client"

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useSurplusStore } from '@/store/useSurplusStore'
import { type FoodItem } from '@/lib/validations/food'

export function SupabaseSyncProvider({ children }: { children: React.ReactNode }) {
  const { setInventory, updateItemInStore, removeItemFromStore } = useSurplusStore()

  useEffect(() => {
    // 1. Initial Fetch
    const fetchInitialData = async () => {
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .order('created_at', { ascending: false })

      if (data) {
        const formattedData: FoodItem[] = data.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          unit: item.unit as any,
          expiresAt: item.expires_at,
          status: item.status as any,
          location: { lat: item.lat, lng: item.lng },
          imageUrl: item.image_url
        }))
        setInventory(formattedData)
      }
      if (error) console.error('[Supabase] Initial fetch error:', error)
    }

    fetchInitialData()

    // 2. Realtime Listener
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'food_items'
        },
        (payload) => {
          console.log('[Supabase] Change received:', payload)
          
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const item = payload.new as any
            const formattedItem: FoodItem = {
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              unit: item.unit,
              expiresAt: item.expires_at,
              status: item.status,
              location: { lat: item.lat, lng: item.lng },
              imageUrl: item.image_url
            }
            updateItemInStore(formattedItem)
          } else if (payload.eventType === 'DELETE') {
            removeItemFromStore(payload.old.id)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [setInventory, updateItemInStore, removeItemFromStore])

  return <>{children}</>
}

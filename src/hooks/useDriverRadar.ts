import { useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

const BROADCAST_INTERVAL_MS = 5000 // Broadcast every 5 seconds
const CHANNEL_NAME = 'driver-radar'

/**
 * Broadcasts the driver's current GPS coordinates to a Supabase Realtime channel.
 * Other clients (Receivers) subscribe to this channel to see live truck movement.
 */
export function useDriverRadar(location: { lat: number; lng: number }, isActive: boolean) {
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const broadcast = useCallback(() => {
    if (!channelRef.current) return
    channelRef.current.send({
      type: 'broadcast',
      event: 'location_update',
      payload: {
        lat: location.lat,
        lng: location.lng,
        timestamp: Date.now(),
        driverId: 'driver-001' // In production, use auth user ID
      }
    })
  }, [location.lat, location.lng])

  useEffect(() => {
    if (!isActive) return

    const channel = supabase.channel(CHANNEL_NAME, {
      config: { broadcast: { self: false } }
    })

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('[Radar] Driver broadcasting on channel:', CHANNEL_NAME)
        // Start periodic broadcasts
        intervalRef.current = setInterval(broadcast, BROADCAST_INTERVAL_MS)
        // Immediate first broadcast
        broadcast()
      }
    })

    channelRef.current = channel

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      supabase.removeChannel(channel)
      channelRef.current = null
    }
  }, [isActive, broadcast])

  return { channelName: CHANNEL_NAME }
}

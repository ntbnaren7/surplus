import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

const CHANNEL_NAME = 'driver-radar'
const STALE_THRESHOLD_MS = 15000 // Mark stale after 15s of no updates

export interface DriverPosition {
  driverId: string
  lat: number
  lng: number
  timestamp: number
}

/**
 * Subscribes to the driver-radar Supabase Realtime channel.
 * Returns a map of all live driver positions for rendering on the Receiver's map.
 */
export function useReceiverRadar() {
  const [driverPositions, setDriverPositions] = useState<Map<string, DriverPosition>>(new Map())
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  useEffect(() => {
    const channel = supabase.channel(CHANNEL_NAME)

    channel
      .on('broadcast', { event: 'location_update' }, (payload) => {
        const data = payload.payload as DriverPosition
        setDriverPositions(prev => {
          const next = new Map(prev)
          next.set(data.driverId, data)
          return next
        })
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[Radar] Receiver listening on channel:', CHANNEL_NAME)
        }
      })

    channelRef.current = channel

    // Cleanup stale drivers every 10s
    const cleanup = setInterval(() => {
      setDriverPositions(prev => {
        const now = Date.now()
        const next = new Map(prev)
        for (const [id, pos] of next) {
          if (now - pos.timestamp > STALE_THRESHOLD_MS) {
            next.delete(id)
          }
        }
        return next
      })
    }, 10000)

    return () => {
      clearInterval(cleanup)
      supabase.removeChannel(channel)
      channelRef.current = null
    }
  }, [])

  return { driverPositions: Array.from(driverPositions.values()) }
}

/* ═══════════════════════════════════════════════════════════
   LOGISTICS LISTENER — Receive vehicle positions in real-time
   ═══════════════════════════════════════════════════════════
   
   Subscribes to the Supabase Realtime "logistics-pulse" channel
   and provides the latest vehicle position, bearing, and progress
   to Receiver and Donor dashboards.
═══════════════════════════════════════════════════════════ */

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

export interface VehiclePosition {
  missionId: string
  lat: number
  lng: number
  bearing: number
  progress: number
  phase: string
  timestamp: number
}

interface UseLogisticsListenerOptions {
  channelName?: string
  enabled?: boolean
}

export function useLogisticsListener(options: UseLogisticsListenerOptions = {}) {
  const {
    channelName = 'logistics-pulse',
    enabled = true,
  } = options

  const [vehicles, setVehicles] = useState<Map<string, VehiclePosition>>(new Map())
  const [lastUpdate, setLastUpdate] = useState<number>(0)
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  useEffect(() => {
    if (!enabled) return

    const channel = supabase.channel(channelName, {
      config: { broadcast: { self: true } }
    })

    channel
      .on('broadcast', { event: 'vehicle_position' }, (payload) => {
        const data = payload.payload as VehiclePosition
        setVehicles(prev => {
          const next = new Map(prev)
          next.set(data.missionId, data)
          return next
        })
        setLastUpdate(Date.now())
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[Listener] Subscribed to:', channelName)
        }
      })

    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
      channelRef.current = null
    }
  }, [channelName, enabled])

  return {
    /** Map of missionId → latest vehicle position */
    vehicles,
    /** All vehicle positions as an array */
    vehicleList: Array.from(vehicles.values()),
    /** Timestamp of last received update */
    lastUpdate,
  }
}

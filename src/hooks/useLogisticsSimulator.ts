/* ═══════════════════════════════════════════════════════════
   LIVE LOGISTICS SIMULATOR — The Physics Engine
   ═══════════════════════════════════════════════════════════
   
   Smoothly animates a vehicle icon along a GeoJSON LineString
   using Turf.js for geospatial interpolation. Broadcasts the
   current position to all connected dashboards via Supabase
   Realtime so Donors, Receivers, and Volunteers see the same
   movement simultaneously.
   
   Localized for: Koramangala, Bangalore (12.93°N, 77.62°E)
═══════════════════════════════════════════════════════════ */

import { useState, useEffect, useRef, useCallback } from 'react'
import along from '@turf/along'
import length from '@turf/length'
import bearing from '@turf/bearing'
import { lineString, point } from '@turf/helpers'
import { supabase } from '@/lib/supabase'

/* ─── Types ─── */
export interface SimulationState {
  /** Current vehicle position */
  position: { lat: number; lng: number }
  /** Compass bearing in degrees (0 = North, 90 = East) */
  bearing: number
  /** 0–100 progress percentage */
  progress: number
  /** Remaining seconds to destination */
  etaSeconds: number
  /** Current phase of the mission */
  phase: 'idle' | 'en_route_to_pickup' | 'at_pickup' | 'en_route_to_dropoff' | 'arrived' | 'completed'
  /** Whether the simulation is actively ticking */
  isRunning: boolean
  /** Human-readable status label */
  statusLabel: string
}

export interface SimulationRoute {
  /** GeoJSON coordinates [lng, lat][] from Mapbox Directions */
  coordinates: [number, number][]
  /** Origin label */
  originName: string
  /** Destination label */
  destinationName: string
}

interface UseLogisticsSimulatorOptions {
  /** Simulated speed in km/h (default: 25 for urban Bangalore) */
  speedKmh?: number
  /** Tick interval in ms (default: 100 for 10fps smooth movement) */
  tickMs?: number
  /** Broadcast channel name (default: 'logistics-pulse') */
  channelName?: string
  /** Mission identifier for multiplexing */
  missionId?: string
}

/* ─── Pre-built demo routes for Koramangala ─── */
export const KORAMANGALA_ROUTES: Record<string, SimulationRoute> = {
  'hotel-empire-to-vemana': {
    coordinates: [
      [77.6200, 12.9345],  // Hotel Empire, 5th Block
      [77.6205, 12.9340],  // 5th Block junction
      [77.6210, 12.9338],  // 80 Feet Rd
      [77.6215, 12.9336],  // Midway on 80 Feet
      [77.6220, 12.9335],  // Near Koramangala Water Tank
      [77.6225, 12.9335],  // Approaching VIT
      [77.6229, 12.9335],  // Vemana Institute of Technology
    ],
    originName: 'Hotel Empire (5th Block)',
    destinationName: 'Vemana IT Community Kitchen',
  },
  'ooty-pastry-to-stjohns': {
    coordinates: [
      [77.6240, 12.9360],  // Ooty Pastry Shop
      [77.6235, 12.9355],  // Inner Ring junction
      [77.6225, 12.9345],  // Cutting through 4th Block
      [77.6215, 12.9335],  // 80 Feet Rd crossing
      [77.6205, 12.9320],  // Hospital Rd approach
      [77.6195, 12.9310],  // Near St. John's gate
      [77.6180, 12.9300],  // St. John's Hospital
    ],
    originName: 'Ooty Pastry Shop',
    destinationName: "St. John's Medical Centre",
  },
  'black-pearl-to-ngo': {
    coordinates: [
      [77.6250, 12.9315],  // The Black Pearl
      [77.6245, 12.9320],  // Jyoti Nivas junction
      [77.6240, 12.9325],  // 4th Block main
      [77.6235, 12.9330],  // Koramangala BDA Complex
      [77.6229, 12.9335],  // Vemana IT
      [77.6220, 12.9340],  // 6th Block entry
      [77.6210, 12.9345],  // Community Centre (NGO Hub)
    ],
    originName: 'The Black Pearl Restaurant',
    destinationName: 'Koramangala Community Centre',
  },
}

/* ═══════════════════════════════════════════════════
   MAIN HOOK
═══════════════════════════════════════════════════ */
export function useLogisticsSimulator(options: UseLogisticsSimulatorOptions = {}) {
  const {
    speedKmh = 25,
    tickMs = 100,
    channelName = 'logistics-pulse',
    missionId = 'mission-001',
  } = options

  /* ─── State ─── */
  const [state, setState] = useState<SimulationState>({
    position: { lat: 12.9335, lng: 77.6229 },
    bearing: 0,
    progress: 0,
    etaSeconds: 0,
    phase: 'idle',
    isRunning: false,
    statusLabel: 'Awaiting dispatch',
  })

  const [route, setRoute] = useState<SimulationRoute | null>(null)
  const [traveledCoords, setTraveledCoords] = useState<[number, number][]>([])
  const [remainingCoords, setRemainingCoords] = useState<[number, number][]>([])

  /* ─── Refs for animation loop ─── */
  const distanceTraveled = useRef(0)
  const totalDistance = useRef(0)
  const turfLine = useRef<ReturnType<typeof lineString> | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const lastTickRef = useRef<number>(0)
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  /* ─── Broadcast position via Supabase Realtime ─── */
  const broadcastPosition = useCallback((pos: { lat: number; lng: number }, brng: number, progress: number, phase: string) => {
    if (!channelRef.current) return
    channelRef.current.send({
      type: 'broadcast',
      event: 'vehicle_position',
      payload: {
        missionId,
        lat: pos.lat,
        lng: pos.lng,
        bearing: brng,
        progress,
        phase,
        timestamp: Date.now(),
      }
    })
  }, [missionId])

  /* ─── Setup Supabase channel ─── */
  useEffect(() => {
    const channel = supabase.channel(channelName, {
      config: { broadcast: { self: false } }
    })
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('[Simulator] Broadcasting on:', channelName)
      }
    })
    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
      channelRef.current = null
    }
  }, [channelName])

  /* ─── The Animation Tick ─── */
  const tick = useCallback((timestamp: number) => {
    if (!turfLine.current || totalDistance.current === 0) return

    const elapsed = timestamp - lastTickRef.current
    if (elapsed < tickMs) {
      animFrameRef.current = requestAnimationFrame(tick)
      return
    }
    lastTickRef.current = timestamp

    // Calculate distance increment based on speed
    const speedKmPerMs = speedKmh / (3600 * 1000) // km per millisecond
    const increment = speedKmPerMs * elapsed

    distanceTraveled.current = Math.min(
      distanceTraveled.current + increment,
      totalDistance.current
    )

    const progress = (distanceTraveled.current / totalDistance.current) * 100

    // Get interpolated position along the line
    const currentPoint = along(turfLine.current, distanceTraveled.current, { units: 'kilometers' })
    const [lng, lat] = currentPoint.geometry.coordinates

    // Calculate bearing to the next point
    let currentBearing = 0
    if (distanceTraveled.current < totalDistance.current) {
      const lookAhead = Math.min(distanceTraveled.current + 0.05, totalDistance.current)
      const nextPoint = along(turfLine.current, lookAhead, { units: 'kilometers' })
      currentBearing = bearing(
        point([lng, lat]),
        point(nextPoint.geometry.coordinates)
      )
    }

    // Build traveled/remaining coordinate arrays for visual line splitting
    const coords = turfLine.current.geometry.coordinates as [number, number][]
    const traveled: [number, number][] = []
    const remaining: [number, number][] = []
    let passedCurrent = false

    for (let i = 0; i < coords.length; i++) {
      const segDist = i === 0 ? 0 : length(
        lineString(coords.slice(0, i + 1)),
        { units: 'kilometers' }
      )
      if (segDist <= distanceTraveled.current) {
        traveled.push(coords[i])
      } else {
        if (!passedCurrent) {
          traveled.push([lng, lat])
          remaining.push([lng, lat])
          passedCurrent = true
        }
        remaining.push(coords[i])
      }
    }

    setTraveledCoords(traveled)
    setRemainingCoords(remaining)

    // Calculate ETA
    const remainingDist = totalDistance.current - distanceTraveled.current
    const etaSeconds = Math.round((remainingDist / speedKmh) * 3600)

    // Determine phase
    let phase: SimulationState['phase'] = 'en_route_to_dropoff'
    let statusLabel = `In transit • ${etaSeconds}s ETA`

    if (progress >= 100) {
      phase = 'arrived'
      statusLabel = 'Arrived at destination'
    } else if (progress < 5) {
      phase = 'en_route_to_pickup'
      statusLabel = 'Departing pickup location'
    }

    const newState: SimulationState = {
      position: { lat, lng },
      bearing: currentBearing,
      progress: Math.min(progress, 100),
      etaSeconds,
      phase,
      isRunning: progress < 100,
      statusLabel,
    }

    setState(newState)
    broadcastPosition({ lat, lng }, currentBearing, progress, phase)

    // Continue animation or stop
    if (progress < 100) {
      animFrameRef.current = requestAnimationFrame(tick)
    } else {
      setState(prev => ({ ...prev, isRunning: false, phase: 'arrived', statusLabel: 'Arrived at destination' }))
    }
  }, [speedKmh, tickMs, broadcastPosition])

  /* ─── Start a simulation run ─── */
  const startSimulation = useCallback((simulationRoute: SimulationRoute) => {
    if (simulationRoute.coordinates.length < 2) return

    // Build turf LineString
    const line = lineString(simulationRoute.coordinates)
    turfLine.current = line
    totalDistance.current = length(line, { units: 'kilometers' })
    distanceTraveled.current = 0

    setRoute(simulationRoute)
    setTraveledCoords([])
    setRemainingCoords(simulationRoute.coordinates)

    // Set initial position
    const [startLng, startLat] = simulationRoute.coordinates[0]
    setState({
      position: { lat: startLat, lng: startLng },
      bearing: 0,
      progress: 0,
      etaSeconds: Math.round((totalDistance.current / speedKmh) * 3600),
      phase: 'en_route_to_pickup',
      isRunning: true,
      statusLabel: `Heading to ${simulationRoute.originName}`,
    })

    // Begin animation
    lastTickRef.current = performance.now()
    animFrameRef.current = requestAnimationFrame(tick)
  }, [speedKmh, tick])

  /* ─── Stop / Reset ─── */
  const stopSimulation = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }
    setState(prev => ({ ...prev, isRunning: false, phase: 'idle', statusLabel: 'Simulation stopped' }))
  }, [])

  const resetSimulation = useCallback(() => {
    stopSimulation()
    distanceTraveled.current = 0
    setTraveledCoords([])
    setRemainingCoords(route?.coordinates ?? [])
    setState({
      position: route ? { lat: route.coordinates[0][1], lng: route.coordinates[0][0] } : { lat: 12.9335, lng: 77.6229 },
      bearing: 0,
      progress: 0,
      etaSeconds: 0,
      phase: 'idle',
      isRunning: false,
      statusLabel: 'Awaiting dispatch',
    })
  }, [stopSimulation, route])

  /* ─── Cleanup on unmount ─── */
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  return {
    state,
    route,
    traveledCoords,
    remainingCoords,
    startSimulation,
    stopSimulation,
    resetSimulation,
  }
}

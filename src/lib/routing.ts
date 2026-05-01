/* ═══════════════════════════════════════════════════════════
   NEURAL NAVIGATOR — Dynamic Multi-Stop Route Optimizer
   ═══════════════════════════════════════════════════════════
   
   Solves the Expiry-Distance Paradox:
   Standard GPS finds the shortest path. Our engine finds the
   SAFEST path — prioritizing stops where food is about to expire,
   even if they're farther away.

   Algorithm: Modified Nearest-Neighbor with Expiry Penalty
   
   In production, this would use:
   - Mapbox Directions API for real road distances
   - OR-Tools / Google Operations Research for exact TSP
   - Real-time traffic data from HERE or TomTom
═══════════════════════════════════════════════════════════ */

import { type FoodItem } from '@/lib/validations/food'
import { calculateDistance } from '@/utils/geo'
import { getHoursUntilExpiry } from '@/utils/time'

export interface RouteStop {
  id: string
  name: string
  location: { lat: number; lng: number }
  hoursToExpiry: number
  quantity: number
  unit: string
  urgencyClass: 'critical' | 'urgent' | 'normal'
  distanceFromPrev: number   // km from previous stop
}

export interface OptimizedRoute {
  stops: RouteStop[]
  totalDistance: number       // km
  estimatedTime: number       // minutes
  timeSaved: number           // minutes saved vs naive order
  expiryRisk: number          // 0-100 (0 = no risk, 100 = items will expire en route)
  optimizationScore: number   // 0-100 (overall route quality)
  routeCoordinates: [number, number][]  // [lng, lat] pairs for the line layer
}

/* ─── Simulated traffic multipliers by city sector ─── */
function getTrafficMultiplier(lat: number, lng: number): number {
  // Simulate heavier traffic in specific sectors
  const sector = Math.floor((lat * 100 + lng * 100) % 5)
  const multipliers = [1.0, 1.3, 1.1, 1.5, 1.2]
  return multipliers[sector]
}

/* ─── Cost function: balances distance vs expiry urgency ─── */
function calculateStopCost(
  distanceKm: number,
  hoursToExpiry: number,
  trafficMultiplier: number
): number {
  const EXPIRY_WEIGHT = 3.0    // How much to penalize near-expiry items
  const DISTANCE_WEIGHT = 1.0  // Base distance cost
  const TRAFFIC_WEIGHT = 0.5   // Traffic influence

  // Distance cost (adjusted for traffic)
  const distanceCost = distanceKm * DISTANCE_WEIGHT * trafficMultiplier * TRAFFIC_WEIGHT

  // Expiry penalty: exponentially increases as time runs out
  let expiryPenalty = 0
  if (hoursToExpiry <= 1) {
    expiryPenalty = 100 * EXPIRY_WEIGHT  // Maximum urgency
  } else if (hoursToExpiry <= 2) {
    expiryPenalty = 60 * EXPIRY_WEIGHT
  } else if (hoursToExpiry <= 4) {
    expiryPenalty = 25 * EXPIRY_WEIGHT
  } else {
    expiryPenalty = 5 * EXPIRY_WEIGHT
  }

  // Lower total cost = higher priority for this stop
  // We SUBTRACT expiry penalty from cost to prioritize urgent items
  return distanceCost - expiryPenalty
}

/* ═══════════════════════════════════════════════════
   MAIN OPTIMIZATION FUNCTION
   Modified Nearest-Neighbor with Expiry Penalty
═══════════════════════════════════════════════════ */
export function optimizeRoute(
  driverLocation: { lat: number; lng: number },
  activeRuns: FoodItem[]
): OptimizedRoute {
  if (activeRuns.length === 0) {
    return {
      stops: [],
      totalDistance: 0,
      estimatedTime: 0,
      timeSaved: 0,
      expiryRisk: 0,
      optimizationScore: 100,
      routeCoordinates: [],
    }
  }

  // Build candidate stops with metadata
  const candidates = activeRuns.map(item => ({
    item,
    hoursToExpiry: getHoursUntilExpiry(item.expiresAt),
  }))

  // Greedy algorithm: at each step, pick the stop with lowest cost
  const orderedStops: RouteStop[] = []
  const remaining = [...candidates]
  let currentPos = { ...driverLocation }
  let totalDistance = 0

  while (remaining.length > 0) {
    let bestIdx = 0
    let bestCost = Infinity

    for (let i = 0; i < remaining.length; i++) {
      const candidate = remaining[i]
      const dist = calculateDistance(
        currentPos.lat, currentPos.lng,
        candidate.item.location.lat, candidate.item.location.lng
      )
      const traffic = getTrafficMultiplier(candidate.item.location.lat, candidate.item.location.lng)
      const cost = calculateStopCost(dist, candidate.hoursToExpiry, traffic)

      if (cost < bestCost) {
        bestCost = cost
        bestIdx = i
      }
    }

    const chosen = remaining.splice(bestIdx, 1)[0]
    const distFromPrev = calculateDistance(
      currentPos.lat, currentPos.lng,
      chosen.item.location.lat, chosen.item.location.lng
    )

    totalDistance += distFromPrev

    const urgencyClass: RouteStop['urgencyClass'] =
      chosen.hoursToExpiry <= 2 ? 'critical' :
      chosen.hoursToExpiry <= 4 ? 'urgent' : 'normal'

    orderedStops.push({
      id: chosen.item.id,
      name: chosen.item.name,
      location: chosen.item.location,
      hoursToExpiry: chosen.hoursToExpiry,
      quantity: chosen.item.quantity,
      unit: chosen.item.unit,
      urgencyClass,
      distanceFromPrev: distFromPrev,
    })

    currentPos = { lat: chosen.item.location.lat, lng: chosen.item.location.lng }
  }

  // Calculate naive (unoptimized) distance for comparison
  let naiveDistance = 0
  let naivePos = { ...driverLocation }
  for (const item of activeRuns) {
    naiveDistance += calculateDistance(naivePos.lat, naivePos.lng, item.location.lat, item.location.lng)
    naivePos = { lat: item.location.lat, lng: item.location.lng }
  }

  // Build route coordinates for Mapbox line layer
  const routeCoordinates: [number, number][] = [
    [driverLocation.lng, driverLocation.lat],
    ...orderedStops.map(s => [s.location.lng, s.location.lat] as [number, number])
  ]

  // Metrics
  const avgSpeed = 30 // km/h in urban area
  const estimatedTime = Math.round((totalDistance / avgSpeed) * 60)
  const naiveTime = Math.round((naiveDistance / avgSpeed) * 60)
  const timeSaved = Math.max(0, naiveTime - estimatedTime)

  // Expiry risk: % of items that might expire before we reach them
  let atRiskCount = 0
  let cumulativeTime = 0
  for (const stop of orderedStops) {
    cumulativeTime += (stop.distanceFromPrev / avgSpeed) * 60 // minutes to this stop
    if ((stop.hoursToExpiry * 60) <= cumulativeTime) {
      atRiskCount++
    }
  }
  const expiryRisk = orderedStops.length > 0 ? Math.round((atRiskCount / orderedStops.length) * 100) : 0

  // Overall optimization score
  const distanceEfficiency = naiveDistance > 0 ? (1 - totalDistance / naiveDistance) * 50 : 25
  const safetyScore = (100 - expiryRisk) * 0.5
  const optimizationScore = Math.min(99, Math.max(10, Math.round(distanceEfficiency + safetyScore)))

  return {
    stops: orderedStops,
    totalDistance: Number(totalDistance.toFixed(1)),
    estimatedTime,
    timeSaved,
    expiryRisk,
    optimizationScore,
    routeCoordinates,
  }
}

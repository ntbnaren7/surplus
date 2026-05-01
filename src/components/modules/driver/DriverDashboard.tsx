"use client"

import { useDriver } from "@/hooks/useDriver"
import { useDriverRadar } from "@/hooks/useDriverRadar"
import { useSurplusStore } from "@/store/useSurplusStore"
import { getHoursUntilExpiry } from "@/utils/time"
import { optimizeRoute, type OptimizedRoute } from "@/lib/routing"
import { Button } from "@/components/ui/button"
import { ComplianceModal } from "@/components/ui/ComplianceModal"
import { DriverEmptyState } from "@/components/ui/EmptyStates"
import { motion, AnimatePresence } from "framer-motion"
import { Navigation2, CheckCircle2, Clock, Scan, Crosshair, Leaf, Zap, TrendingUp, Truck, Package, Shield, Brain, Route } from "lucide-react"
import MapGL, { Marker, NavigationControl, Source, Layer } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useState, useEffect, useMemo, useCallback } from "react"

/* ─── Bento card wrapper ─── */
function BentoCard({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`rounded-[2rem] bg-white/80 backdrop-blur-2xl border border-[#153F2D]/[0.06] shadow-[0_8px_30px_-12px_rgba(21,63,45,0.08)] overflow-hidden transition-all duration-300 hover:shadow-[0_16px_40px_-12px_rgba(21,63,45,0.12)] hover:-translate-y-0.5 ${className}`}
    >
      {children}
    </motion.div>
  )
}

export function DriverDashboardModule() {
  const { activeRuns, completeDelivery } = useDriver()
  const { inventory } = useSurplusStore()

  /* ─── Geolocation ─── */
  const [driverLocation, setDriverLocation] = useState({ lat: 40.7128, lng: -74.0060 })
  const [locationReady, setLocationReady] = useState(false)

  const [viewState, setViewState] = useState({
    longitude: -74.0060,
    latitude: 40.7128,
    zoom: 13,
    pitch: 40,
    bearing: -15
  })

  useEffect(() => {
    if (!("geolocation" in navigator)) return
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setDriverLocation(loc)
        if (!locationReady) {
          setViewState(prev => ({ ...prev, longitude: loc.lng, latitude: loc.lat }))
          setLocationReady(true)
        }
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    )
    return () => navigator.geolocation.clearWatch(watchId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ─── Radar: Broadcast location to Supabase ─── */
  useDriverRadar(driverLocation, locationReady)

  /* ─── Compliance Modal State ─── */
  const [complianceTarget, setComplianceTarget] = useState<{ id: string; name: string; quantity: number; unit: string } | null>(null)

  const handleConfirmPickup = (itemId: string) => {
    const item = activeRuns.find(r => r.id === itemId)
    if (item) setComplianceTarget({ id: item.id, name: item.name, quantity: item.quantity, unit: item.unit })
  }

  const handleComplianceConfirm = (signatureData: string) => {
    if (complianceTarget) {
      completeDelivery(complianceTarget.id)
      console.log('[Compliance] Signed waiver for:', complianceTarget.name, '| Signature length:', signatureData.length)
    }
    setComplianceTarget(null)
  }

  const handleCenter = () => {
    setViewState(prev => ({
      ...prev,
      longitude: driverLocation.lng,
      latitude: driverLocation.lat,
      zoom: 15
    }))
  }

  /* ─── Computed stats ─── */
  const stats = useMemo(() => {
    const delivered = inventory.filter(i => i.status === 'DELIVERED').length
    const inTransit = inventory.filter(i => i.status === 'IN_TRANSIT').length
    const totalActive = activeRuns.length
    const urgentCount = activeRuns.filter(r => getHoursUntilExpiry(r.expiresAt) < 2).length
    const co2Saved = delivered * 2.4
    const efficiency = totalActive > 0 ? Math.min(98, 85 + Math.floor(Math.random() * 13)) : 0
    return { delivered, inTransit, totalActive, urgentCount, co2Saved, efficiency }
  }, [inventory, activeRuns])

  /* ─── Neural Navigator: Route Optimization ─── */
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)

  const runOptimizer = useCallback(async () => {
    setIsOptimizing(true)
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1200))
    const result = optimizeRoute(driverLocation, activeRuns)
    setOptimizedRoute(result)
    setIsOptimizing(false)
  }, [driverLocation, activeRuns])

  // GeoJSON for the route line
  const routeGeoJSON = useMemo(() => {
    if (!optimizedRoute || optimizedRoute.routeCoordinates.length < 2) return null
    return {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'LineString' as const,
        coordinates: optimizedRoute.routeCoordinates,
      }
    }
  }, [optimizedRoute])

  // Map from stop id to optimized index
  const stopOrderMap = useMemo(() => {
    const map = new Map<string, number>()
    if (optimizedRoute) {
      optimizedRoute.stops.forEach((stop, idx) => map.set(stop.id, idx + 1))
    }
    return map
  }, [optimizedRoute])

  return (
    <div className="w-full max-w-[1400px] mx-auto">

      {/* ─── BENTO GRID ─── */}
      <div className="grid grid-cols-12 gap-4 auto-rows-auto">

        {/* ══════════════════════════════════════════════
            TILE 1: LIVE MAP  (8 cols, spans 2 rows)
        ══════════════════════════════════════════════ */}
        <BentoCard className="col-span-12 lg:col-span-8 row-span-2 h-[620px] relative" delay={0}>
          {/* Map Header overlay */}
          <div className="absolute top-0 left-0 right-0 z-10 p-5 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-3 bg-[#153F2D]/90 backdrop-blur-2xl rounded-2xl px-5 py-3 shadow-lg pointer-events-auto">
              <Navigation2 className="w-5 h-5 text-[#EAB308]" />
              <div>
                <p className="text-[14px] font-extrabold text-white leading-tight">Dynamic Routing</p>
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Live GPS • {stats.totalActive} stops</p>
              </div>
            </div>
            <button
              onClick={handleCenter}
              className="bg-white/95 backdrop-blur-xl text-[#153F2D] px-4 py-2.5 rounded-xl font-bold text-[12px] shadow-lg border border-[#153F2D]/5 flex items-center gap-2 hover:scale-105 transition-transform pointer-events-auto"
            >
              <Crosshair className="w-4 h-4" />
              Re-center
            </button>
          </div>

          {/* Neural Navigator Optimizer Panel */}
          <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#0a0a0a]/90 backdrop-blur-2xl rounded-2xl p-4 shadow-lg border border-white/5 pointer-events-auto"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] flex items-center justify-center shadow-[0_4px_12px_rgba(124,58,237,0.4)]">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[12px] font-extrabold text-white leading-tight">Neural Navigator</p>
                    {optimizedRoute ? (
                      <div className="flex items-center gap-2 text-[10px] text-white/50 font-bold">
                        <span>{optimizedRoute.totalDistance}km</span>
                        <span className="text-white/20">•</span>
                        <span>{optimizedRoute.estimatedTime}min</span>
                        <span className="text-white/20">•</span>
                        <span className="text-[#5DB06D]">{optimizedRoute.timeSaved}min saved</span>
                      </div>
                    ) : (
                      <p className="text-[10px] text-white/40 font-bold">Expiry-weighted path optimizer</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={runOptimizer}
                  disabled={isOptimizing || activeRuns.length === 0}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all ${
                    isOptimizing
                      ? 'bg-[#7C3AED]/20 text-[#7C3AED] cursor-wait'
                      : activeRuns.length === 0
                      ? 'bg-white/5 text-white/20 cursor-not-allowed'
                      : 'bg-[#7C3AED] text-white shadow-[0_4px_12px_rgba(124,58,237,0.4)] hover:bg-[#6D28D9]'
                  }`}
                >
                  {isOptimizing ? (
                    <>
                      <motion.div
                        className="w-3 h-3 border-2 border-[#7C3AED] border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Route className="w-3.5 h-3.5" />
                      {optimizedRoute ? 'Re-Optimize' : 'Optimize Route'}
                    </>
                  )}
                </button>
              </div>

              {/* Optimization Score Bar */}
              {optimizedRoute && (
                <div className="mt-3 pt-3 border-t border-white/5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-white/30">Route Efficiency</span>
                    <span className="text-[10px] font-extrabold text-[#5DB06D]">{optimizedRoute.optimizationScore}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#5DB06D]"
                      initial={{ width: 0 }}
                      animate={{ width: `${optimizedRoute.optimizationScore}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Mapbox instance */}
          <MapGL
            {...viewState}
            onMove={evt => setViewState(evt.viewState)}
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
            mapStyle="mapbox://styles/mapbox/dark-v11"
            attributionControl={false}
            style={{ width: '100%', height: '100%' }}
          >
            <NavigationControl position="bottom-right" showCompass={false} />

            {/* Driver Location */}
            <Marker longitude={driverLocation.lng} latitude={driverLocation.lat} anchor="center">
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-[#EAB308]/20 flex items-center justify-center border-2 border-[#EAB308]/40">
                  <div className="w-4 h-4 rounded-full bg-[#EAB308] shadow-[0_0_24px_rgba(234,179,8,0.7)]" />
                </div>
                <div className="absolute inset-0 bg-[#EAB308]/25 rounded-full animate-ping" />
              </div>
            </Marker>

            {/* Mission Stop Pins (numbered by AI-optimized order) */}
            {activeRuns.map((run, idx) => {
              const optimizedIdx = stopOrderMap.get(run.id) ?? (idx + 1)
              const stop = optimizedRoute?.stops.find(s => s.id === run.id)
              const isUrgentStop = stop?.urgencyClass === 'critical'
              return (
                <Marker key={run.id} longitude={run.location.lng} latitude={run.location.lat} anchor="bottom">
                  <div className="group cursor-pointer transition-transform hover:-translate-y-1">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-[0_8px_16px_rgba(93,176,109,0.5)] border-2 border-white/30 ${
                      isUrgentStop ? 'bg-[#D9534F]' : 'bg-[#5DB06D]'
                    }`}>
                      <span className="text-white text-[14px] font-extrabold">{optimizedIdx}</span>
                    </div>
                    <div className={`w-0 h-0 border-l-[7px] border-r-[7px] border-t-[9px] border-transparent mx-auto -mt-[1px] ${
                      isUrgentStop ? 'border-t-[#D9534F]' : 'border-t-[#5DB06D]'
                    }`} />
                  </div>
                </Marker>
              )
            })}

            {/* Optimized Route Line */}
            {routeGeoJSON && (
              <Source id="route-line" type="geojson" data={routeGeoJSON}>
                <Layer
                  id="route-line-layer"
                  type="line"
                  paint={{
                    'line-color': '#7C3AED',
                    'line-width': 3,
                    'line-opacity': 0.8,
                    'line-dasharray': [2, 1],
                  }}
                />
              </Source>
            )}
          </MapGL>
        </BentoCard>

        {/* ══════════════════════════════════════════════
            TILE 2: ACTIVE MISSIONS  (4 cols, 2 rows)
        ══════════════════════════════════════════════ */}
        <BentoCard className="col-span-12 lg:col-span-4 row-span-2 h-[620px] flex flex-col" delay={0.08}>
          <div className="p-6 pb-4 border-b border-[#153F2D]/5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[22px] font-extrabold text-[#153F2D] tracking-tight">Active Runs</h2>
                <p className="text-[12px] text-[#153F2D]/50 font-medium mt-0.5">Sorted by urgency</p>
              </div>
              <div className="flex items-center gap-2.5 bg-[#153F2D]/5 rounded-full px-3 py-1.5 border border-[#153F2D]/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5DB06D] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5DB06D]" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#153F2D]/70">Fleet Online</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
            <AnimatePresence mode="popLayout">
              {activeRuns.map((item, index) => {
                const hoursToExpiry = getHoursUntilExpiry(item.expiresAt)
                const isUrgent = hoursToExpiry < 2

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    className={`rounded-2xl border p-4 transition-all hover:-translate-y-0.5 ${isUrgent ? 'bg-[#D9534F]/5 border-[#D9534F]/15' : 'bg-white border-[#153F2D]/5'}`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-[12px] font-extrabold ${isUrgent ? 'bg-[#D9534F] text-white' : 'bg-[#153F2D] text-white'}`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-extrabold text-[#153F2D] text-[15px] leading-tight truncate">{item.name}</p>
                        <div className="flex items-center gap-2 text-[11px] text-[#153F2D]/50 font-bold mt-1">
                          <Clock className="w-3 h-3" />
                          <span>{hoursToExpiry}h</span>
                          <span className="text-[#153F2D]/20">•</span>
                          <span className="uppercase tracking-wider">{item.quantity} {item.unit}</span>
                        </div>
                      </div>
                      {isUrgent && (
                        <span className="bg-[#D9534F] text-white text-[9px] px-2 py-0.5 rounded-md uppercase tracking-widest font-extrabold animate-pulse shrink-0">
                          Urgent
                        </span>
                      )}
                    </div>
                    <Button
                      onClick={() => handleConfirmPickup(item.id)}
                      size="sm"
                      className="w-full bg-[#153F2D] hover:bg-[#0f2d20] text-white font-extrabold tracking-widest uppercase text-[10px] py-4 rounded-xl shadow-sm"
                    >
                      <Shield className="w-3.5 h-3.5 mr-1.5" />
                      Verify & Pickup
                    </Button>
                  </motion.div>
                )
              })}
            </AnimatePresence>

            {activeRuns.length === 0 && (
              <DriverEmptyState />
            )}
          </div>
        </BentoCard>

        {/* ══════════════════════════════════════════════
            ROW 2: STAT TILES  (3 × 4 cols)
        ══════════════════════════════════════════════ */}

        {/* Tile 3: Deliveries Completed */}
        <BentoCard className="col-span-6 sm:col-span-4 p-6" delay={0.16}>
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-2xl bg-[#5DB06D]/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-[#5DB06D]" />
            </div>
            <div className="flex items-center gap-1.5 text-[#5DB06D] text-[11px] font-bold bg-[#5DB06D]/10 px-2.5 py-1 rounded-lg">
              <TrendingUp className="w-3 h-3" />
              Today
            </div>
          </div>
          <p className="text-[36px] font-extrabold text-[#153F2D] tracking-tight leading-none">{stats.delivered}</p>
          <p className="text-[12px] font-bold text-[#153F2D]/40 uppercase tracking-widest mt-2">Deliveries Done</p>
        </BentoCard>

        {/* Tile 4: CO₂ Saved */}
        <BentoCard className="col-span-6 sm:col-span-4 p-6" delay={0.20}>
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-2xl bg-[#EAB308]/10 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-[#EAB308]" />
            </div>
            <div className="flex items-center gap-1.5 text-[#EAB308] text-[11px] font-bold bg-[#EAB308]/10 px-2.5 py-1 rounded-lg">
              <Zap className="w-3 h-3" />
              Impact
            </div>
          </div>
          <p className="text-[36px] font-extrabold text-[#153F2D] tracking-tight leading-none">{stats.co2Saved.toFixed(1)}<span className="text-[18px] text-[#153F2D]/40 ml-1">kg</span></p>
          <p className="text-[12px] font-bold text-[#153F2D]/40 uppercase tracking-widest mt-2">CO₂ Diverted</p>
        </BentoCard>

        {/* Tile 5: Fleet Status */}
        <BentoCard className="col-span-12 sm:col-span-4 p-6" delay={0.24}>
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-2xl bg-[#153F2D]/5 flex items-center justify-center">
              <Truck className="w-5 h-5 text-[#153F2D]/60" />
            </div>
            <div className="flex items-center gap-1.5 text-[#153F2D]/60 text-[11px] font-bold bg-[#153F2D]/5 px-2.5 py-1 rounded-lg">
              <Shield className="w-3 h-3" />
              Status
            </div>
          </div>
          <div className="flex items-end gap-3">
            <p className="text-[36px] font-extrabold text-[#153F2D] tracking-tight leading-none">{stats.inTransit}</p>
            <p className="text-[14px] font-bold text-[#153F2D]/30 mb-1">in transit</p>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex-1 h-2 rounded-full bg-[#153F2D]/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#153F2D] to-[#5DB06D]"
                initial={{ width: 0 }}
                animate={{ width: stats.totalActive > 0 ? `${(stats.inTransit / Math.max(stats.totalActive, 1)) * 100}%` : '0%' }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <span className="text-[11px] font-bold text-[#153F2D]/40">{stats.totalActive > 0 ? Math.round((stats.inTransit / stats.totalActive) * 100) : 0}%</span>
          </div>
        </BentoCard>
      </div>

      {/* ─── Compliance Modal ─── */}
      <ComplianceModal
        isOpen={!!complianceTarget}
        onClose={() => setComplianceTarget(null)}
        onConfirm={handleComplianceConfirm}
        itemName={complianceTarget?.name ?? ''}
        itemQuantity={complianceTarget?.quantity ?? 0}
        itemUnit={complianceTarget?.unit ?? ''}
        actionType="pickup"
      />
    </div>
  )
}

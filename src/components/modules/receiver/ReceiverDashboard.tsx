"use client"

import { useReceiver } from "@/hooks/useReceiver"
import { useReceiverRadar } from "@/hooks/useReceiverRadar"
import { useLogisticsListener } from "@/hooks/useLogisticsListener"
import { useSurplusStore } from "@/store/useSurplusStore"
import { getHoursUntilExpiry } from "@/utils/time"
import { calculateMatchScores, type MatchResult } from "@/lib/matching"
import { Button } from "@/components/ui/button"
import { ReceiverEmptyState } from "@/components/ui/EmptyStates"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, Navigation, CheckCircle2, Package, Truck, Zap, Activity, Crosshair, Leaf, TrendingUp, Brain } from "lucide-react"
import MapGL, { Marker, NavigationControl } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useState, useEffect, useMemo } from "react"

/* ─── Bento card wrapper (shared pattern from Driver) ─── */
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

export function ReceiverDashboardModule() {
  const { availableItems, incomingItems, claimSurplus } = useReceiver()
  const { inventory } = useSurplusStore()
  const { driverPositions } = useReceiverRadar()
  const { vehicleList } = useLogisticsListener()

  /* ─── Smart Match Engine ─── */
  const matchScores = useMemo(() => {
    if (availableItems.length === 0) return new Map<string, MatchResult>()
    const results = calculateMatchScores(availableItems)
    const map = new Map<string, MatchResult>()
    results.forEach(r => map.set(r.itemId, r))
    return map
  }, [availableItems])

  /* ─── Geolocation (Receiver facility) ─── */
  const [facilityLocation, setFacilityLocation] = useState({ lat: 12.9335, lng: 77.6229 })
  const [locationReady, setLocationReady] = useState(false)

  const [viewState, setViewState] = useState({
    longitude: 77.6229,
    latitude: 12.9335,
    zoom: 14.5,
    pitch: 0,
    bearing: 0
  })

  useEffect(() => {
    if (!("geolocation" in navigator)) return
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setFacilityLocation(loc)
        if (!locationReady) {
          setViewState(prev => ({ ...prev, longitude: loc.lng, latitude: loc.lat }))
          setLocationReady(true)
        }
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 30000, timeout: 5000 }
    )
    return () => navigator.geolocation.clearWatch(watchId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCenter = () => {
    setViewState(prev => ({
      ...prev,
      longitude: facilityLocation.lng,
      latitude: facilityLocation.lat,
      zoom: 14
    }))
  }

  /* ─── Computed stats ─── */
  const stats = useMemo(() => {
    const delivered = inventory.filter(i => i.status === 'DELIVERED').length
    const inTransit = incomingItems.length
    const totalAvailable = availableItems.length
    const mealsRecovered = delivered * 12 // ~12 meals per batch
    const co2Diverted = delivered * 2.4
    return { delivered, inTransit, totalAvailable, mealsRecovered, co2Diverted }
  }, [inventory, incomingItems, availableItems])

  return (
    <div className="w-full max-w-[1400px] mx-auto">

      {/* ─── BENTO GRID ─── */}
      <div className="grid grid-cols-12 gap-4 auto-rows-auto">

        {/* ══════════════════════════════════════════════
            TILE 1: DISCOVERY MAP  (8 cols, 2 rows)
        ══════════════════════════════════════════════ */}
        <BentoCard className="col-span-12 lg:col-span-8 row-span-2 h-[620px] relative" delay={0}>
          {/* Map Header overlay */}
          <div className="absolute top-0 left-0 right-0 z-10 p-5 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-3 bg-[#153F2D]/90 backdrop-blur-2xl rounded-2xl px-5 py-3 shadow-lg pointer-events-auto">
              <Activity className="w-5 h-5 text-[#5DB06D]" />
              <div>
                <p className="text-[14px] font-extrabold text-white leading-tight">Surplus Radar</p>
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Live Scan • {stats.totalAvailable} nearby</p>
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

            {/* Facility Location (Receiver's own pin) */}
            <Marker longitude={facilityLocation.lng} latitude={facilityLocation.lat} anchor="center">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-[#5DB06D]/20 flex items-center justify-center border-2 border-[#5DB06D]/40">
                  <div className="w-5 h-5 rounded-full bg-[#5DB06D] shadow-[0_0_24px_rgba(93,176,109,0.7)]" />
                </div>
                <div className="absolute inset-0 bg-[#5DB06D]/25 rounded-full animate-ping" />
              </div>
            </Marker>

            {/* Available Food Drop Pins */}
            {availableItems.map((item) => {
              const isCritical = item.priorityScore >= 150
              const pinColor = isCritical ? '#D9534F' : '#EAB308'
              return (
                <Marker key={item.id} longitude={item.location.lng} latitude={item.location.lat} anchor="bottom">
                  <div className="group cursor-pointer transition-transform hover:-translate-y-1">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center shadow-[0_8px_16px_rgba(0,0,0,0.3)] border-2 border-white/30"
                      style={{ backgroundColor: pinColor }}
                    >
                      <Package className="w-4 h-4 text-white" />
                    </div>
                    <div
                      className="w-0 h-0 border-l-[7px] border-r-[7px] border-t-[9px] border-transparent mx-auto -mt-[1px]"
                      style={{ borderTopColor: pinColor }}
                    />
                  </div>
                </Marker>
              )
            })}

            {/* In-Transit Truck Pins (static from inventory) */}
            {incomingItems.map((item) => (
              <Marker key={item.id} longitude={item.location.lng} latitude={item.location.lat} anchor="center">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-[#5DB06D]/20 flex items-center justify-center border border-[#5DB06D]/30">
                    <Truck className="w-4 h-4 text-[#5DB06D]" />
                  </div>
                  <div className="absolute inset-0 bg-[#5DB06D]/20 rounded-full animate-ping opacity-60" />
                </div>
              </Marker>
            ))}

            {/* Live Driver Radar Pins (real-time from Supabase broadcast) */}
            {driverPositions.map((dp) => (
              <Marker key={dp.driverId} longitude={dp.lng} latitude={dp.lat} anchor="center">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-[#EAB308]/20 flex items-center justify-center border-2 border-[#EAB308]/40">
                    <div className="w-4 h-4 rounded-full bg-[#EAB308] shadow-[0_0_24px_rgba(234,179,8,0.7)]" />
                  </div>
                  <div className="absolute inset-0 bg-[#EAB308]/25 rounded-full animate-ping" />
                </div>
              </Marker>
            ))}

            {/* Live Simulator Vehicle Pins (from logistics-pulse channel) */}
            {vehicleList.map((v) => (
              <Marker key={v.missionId} longitude={v.lng} latitude={v.lat} anchor="center">
                <div
                  className="relative"
                  style={{ transform: `rotate(${v.bearing}deg)` }}
                >
                  <div className="w-10 h-10 rounded-full bg-[#0EA5E9] flex items-center justify-center border-2 border-white shadow-[0_0_20px_rgba(14,165,233,0.6)]">
                    <Truck className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="absolute inset-[-4px] bg-[#0EA5E9]/20 rounded-full animate-ping" />
              </Marker>
            ))}
          </MapGL>
        </BentoCard>

        {/* ══════════════════════════════════════════════
            TILE 2: PRIORITY CLAIM FEED  (4 cols, 2 rows)
        ══════════════════════════════════════════════ */}
        <BentoCard className="col-span-12 lg:col-span-4 row-span-2 h-[620px] flex flex-col" delay={0.08}>
          <div className="p-6 pb-4 border-b border-[#153F2D]/5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[22px] font-extrabold text-[#153F2D] tracking-tight">Surplus Feed</h2>
                <p className="text-[12px] text-[#153F2D]/50 font-medium mt-0.5">AI-matched to your facility profile</p>
              </div>
              <div className="flex items-center gap-2.5 bg-[#5DB06D]/10 rounded-full px-3 py-1.5 border border-[#5DB06D]/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5DB06D] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5DB06D]" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#5DB06D]">Live Radar</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
            <AnimatePresence mode="popLayout">
              {availableItems.map((item) => {
                const hoursToExpiry = getHoursUntilExpiry(item.expiresAt)
                const isCritical = item.priorityScore >= 150
                const isUrgent = hoursToExpiry < 3
                const confidenceWidth = Math.min(100, Math.max(0, (item.priorityScore / 200) * 100))

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    className={`rounded-2xl border p-4 transition-all hover:-translate-y-0.5 ${isCritical ? 'bg-[#D9534F]/5 border-[#D9534F]/15' : 'bg-white border-[#153F2D]/5'}`}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isCritical ? 'bg-[#D9534F]/10' : 'bg-[#153F2D]/5'}`}>
                        {isCritical ? <Zap className="w-4 h-4 text-[#D9534F]" /> : <Package className="w-4 h-4 text-[#153F2D]/40" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-extrabold text-[#153F2D] text-[15px] leading-tight truncate">{item.name}</p>
                        <div className="flex items-center gap-2 text-[11px] text-[#153F2D]/50 font-bold mt-1">
                          <Clock className="w-3 h-3" />
                          <span>{hoursToExpiry}h</span>
                          <span className="text-[#153F2D]/20">•</span>
                          <Navigation className="w-3 h-3" />
                          <span>{item.distance}km</span>
                          <span className="text-[#153F2D]/20">•</span>
                          <span className="uppercase tracking-wider">{item.quantity} {item.unit}</span>
                        </div>
                      </div>
                      {isCritical && (
                        <span className="bg-[#D9534F] text-white text-[9px] px-2 py-0.5 rounded-md uppercase tracking-widest font-extrabold animate-pulse shrink-0">
                          Critical
                        </span>
                      )}
                      {!isCritical && isUrgent && (
                        <span className="bg-[#F0AD4E] text-white text-[9px] px-2 py-0.5 rounded-md uppercase tracking-widest font-extrabold shrink-0">
                          Urgent
                        </span>
                      )}
                    </div>

                    {/* Priority Score Bar — now powered by Smart Match */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1.5">
                          <Brain className="w-3 h-3 text-[#7C3AED]/60" />
                          <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#153F2D]/30">Smart Match</span>
                        </div>
                        {(() => {
                          const match = matchScores.get(item.id)
                          if (!match) return <span className="text-[10px] font-bold text-[#5DB06D]">{Math.round(confidenceWidth)}%</span>
                          const gradeColor = match.matchGrade === 'A+' ? 'text-[#5DB06D] bg-[#5DB06D]/10' :
                            match.matchGrade === 'A' ? 'text-[#5DB06D] bg-[#5DB06D]/10' :
                            match.matchGrade === 'B' ? 'text-[#EAB308] bg-[#EAB308]/10' :
                            'text-[#153F2D]/50 bg-[#153F2D]/5'
                          return (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold text-[#7C3AED]">{match.matchScore}%</span>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold ${gradeColor}`}>{match.matchGrade}</span>
                            </div>
                          )
                        })()}
                      </div>
                      <div className="h-1 w-full bg-[#153F2D]/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#7C3AED] to-[#5DB06D] rounded-full transition-all duration-1000"
                          style={{ width: `${matchScores.get(item.id)?.matchScore ?? confidenceWidth}%` }}
                        />
                      </div>
                      {/* Reasoning tooltip */}
                      {matchScores.get(item.id) && (
                        <p className="text-[9px] text-[#7C3AED]/60 font-medium mt-1.5 leading-relaxed">
                          {matchScores.get(item.id)!.reasoning}
                        </p>
                      )}
                    </div>

                    <Button
                      onClick={() => claimSurplus(item.id)}
                      size="sm"
                      className={`w-full font-extrabold tracking-widest uppercase text-[10px] py-4 rounded-xl shadow-sm ${isCritical ? 'bg-[#D9534F] hover:bg-[#c9302c] text-white' : 'bg-[#153F2D] hover:bg-[#0f2d20] text-white'}`}
                    >
                      <Truck className="w-3.5 h-3.5 mr-1.5" />
                      Claim & Dispatch
                    </Button>
                  </motion.div>
                )
              })}
            </AnimatePresence>

            {availableItems.length === 0 && (
              <ReceiverEmptyState />
            )}
          </div>
        </BentoCard>

        {/* ══════════════════════════════════════════════
            TILE 3: INCOMING LOGISTICS  (6 cols)
        ══════════════════════════════════════════════ */}
        <BentoCard className="col-span-12 lg:col-span-6 flex flex-col" delay={0.16}>
          <div className="p-6 pb-4 border-b border-[#153F2D]/5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[18px] font-extrabold text-[#153F2D] tracking-tight">Incoming Deliveries</h2>
                <p className="text-[11px] text-[#153F2D]/50 font-medium mt-0.5">Drivers en route to your facility</p>
              </div>
              <div className="flex items-center gap-2 text-[12px] font-bold text-[#5DB06D] bg-[#5DB06D]/10 px-3 py-1.5 rounded-lg">
                <Truck className="w-3.5 h-3.5" />
                {stats.inTransit} active
              </div>
            </div>
          </div>

          <div className="p-4 space-y-3 max-h-[220px] overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {incomingItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#153F2D]/5 hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-[#5DB06D]/10 flex items-center justify-center border border-[#5DB06D]/20">
                        <Truck className="w-4.5 h-4.5 text-[#5DB06D]" />
                      </div>
                      <div className="absolute inset-0 bg-[#5DB06D]/15 rounded-full animate-ping opacity-50" />
                    </div>
                    <div>
                      <p className="font-extrabold text-[#153F2D] text-[14px] leading-tight">{item.name}</p>
                      <div className="flex items-center gap-2 text-[11px] text-[#153F2D]/50 font-bold mt-0.5">
                        <span className="uppercase tracking-wider">{item.quantity} {item.unit}</span>
                        <span className="text-[#153F2D]/20">•</span>
                        <span className="text-[#5DB06D] font-extrabold">ETA 12 min</span>
                      </div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#5DB06D]/10 text-[#5DB06D] text-[10px] font-extrabold uppercase tracking-widest shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5DB06D] animate-pulse" />
                    In Transit
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>

            {incomingItems.length === 0 && (
              <div className="py-10 text-center">
                <Truck className="w-7 h-7 text-[#153F2D]/10 mx-auto mb-2" />
                <p className="text-[13px] font-bold text-[#153F2D]/40">No incoming deliveries</p>
              </div>
            )}
          </div>
        </BentoCard>

        {/* ══════════════════════════════════════════════
            TILE 4: COMMUNITY IMPACT  (3 cols)
        ══════════════════════════════════════════════ */}
        <BentoCard className="col-span-6 lg:col-span-3 p-6" delay={0.20}>
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-2xl bg-[#5DB06D]/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-[#5DB06D]" />
            </div>
            <div className="flex items-center gap-1.5 text-[#5DB06D] text-[11px] font-bold bg-[#5DB06D]/10 px-2.5 py-1 rounded-lg">
              <TrendingUp className="w-3 h-3" />
              Today
            </div>
          </div>
          <p className="text-[36px] font-extrabold text-[#153F2D] tracking-tight leading-none">{stats.mealsRecovered}</p>
          <p className="text-[12px] font-bold text-[#153F2D]/40 uppercase tracking-widest mt-2">Meals Recovered</p>
        </BentoCard>

        {/* ══════════════════════════════════════════════
            TILE 5: CO₂ IMPACT  (3 cols)
        ══════════════════════════════════════════════ */}
        <BentoCard className="col-span-6 lg:col-span-3 p-6" delay={0.24}>
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-2xl bg-[#EAB308]/10 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-[#EAB308]" />
            </div>
            <div className="flex items-center gap-1.5 text-[#EAB308] text-[11px] font-bold bg-[#EAB308]/10 px-2.5 py-1 rounded-lg">
              <Zap className="w-3 h-3" />
              Impact
            </div>
          </div>
          <p className="text-[36px] font-extrabold text-[#153F2D] tracking-tight leading-none">{stats.co2Diverted.toFixed(1)}<span className="text-[18px] text-[#153F2D]/40 ml-1">kg</span></p>
          <p className="text-[12px] font-bold text-[#153F2D]/40 uppercase tracking-widest mt-2">CO₂ Diverted</p>
        </BentoCard>
      </div>
    </div>
  )
}

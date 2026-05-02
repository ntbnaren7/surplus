"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion"
import MapGL, { Marker, NavigationControl } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MapPin, Navigation, Zap, Leaf, CheckCircle2, TrendingUp, Trophy, ArrowRight, Package, Truck, Bike, Footprints } from "lucide-react"
import confetti from "canvas-confetti"

/* ─── Bento card wrapper ─── */
function BentoCard({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
      className={`rounded-[2rem] bg-white border border-[#153F2D]/5 shadow-[0_8px_32px_-12px_rgba(21,63,45,0.08)] overflow-hidden relative ${className}`}
    >
      {children}
    </motion.div>
  )
}

/* ─── Swipe to Accept Button ─── */
function SwipeToAccept({ onAccept }: { onAccept: () => void }) {
  const [isAccepted, setIsAccepted] = useState(false)
  const x = useMotionValue(0)
  const opacity = useTransform(x, [0, 150], [1, 0])
  const background = useTransform(
    x,
    [0, 150],
    ['rgba(14, 165, 233, 0.1)', 'rgba(14, 165, 233, 1)'] // from subtle to full Energy Blue
  )

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 150) {
      setIsAccepted(true)
      onAccept()
    }
  }

  return (
    <motion.div 
      style={{ background }}
      className="relative w-full h-14 rounded-2xl flex items-center overflow-hidden border border-[#0EA5E9]/20"
    >
      {!isAccepted ? (
        <>
          <motion.div style={{ opacity }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[12px] font-extrabold uppercase tracking-widest text-[#0EA5E9]">Swipe to Rescue</span>
          </motion.div>
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 180 }}
            dragElastic={0.05}
            onDragEnd={handleDragEnd}
            style={{ x }}
            whileTap={{ cursor: "grabbing" }}
            className="absolute left-1 w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center cursor-grab z-10"
          >
            <ArrowRight className="w-5 h-5 text-[#0EA5E9]" />
          </motion.div>
        </>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span className="text-[12px] font-extrabold uppercase tracking-widest text-white">Mission Accepted</span>
        </motion.div>
      )}
    </motion.div>
  )
}

export function VolunteerDashboard() {
  const [viewState, setViewState] = useState({
    longitude: 77.6229,
    latitude: 12.9335,
    zoom: 14.5
  })
  
  const [activeMission, setActiveMission] = useState<string | null>(null)
  const [transportMode, setTransportMode] = useState<'walk' | 'bike' | 'drive'>('bike')

  const triggerConfetti = () => {
    const duration = 3000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#0EA5E9', '#5DB06D', '#FDFBF7']
      })
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#0EA5E9', '#5DB06D', '#FDFBF7']
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()
  }

  const handleAcceptMission = (id: string) => {
    setActiveMission(id)
    triggerConfetti()
  }

  // Simulated active pings (Koramangala, Bangalore)
  const pings = [
    { id: '1', name: 'Chicken Biryani Surplus', qty: '25 kg', distance: '0.8 km', urgency: 'High', lat: 12.9345, lng: 77.6200 }, // Hotel Empire
    { id: '2', name: 'Fresh Milk (Tetra Packs)', qty: '12 liters', distance: '1.2 km', urgency: 'Medium', lat: 12.9300, lng: 77.6180 }, // St. John's
    { id: '3', name: 'Mixed Artisan Pastries', qty: '15 boxes', distance: '2.5 km', urgency: 'High', lat: 12.9360, lng: 77.6240 }, // Ooty Pastry
  ]

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      <div className="grid grid-cols-12 gap-4 auto-rows-auto">

        {/* ══════════════════════════════════════════════
            TILE 1: ACTIVE PULSE MAP (8 cols, 2 rows)
        ══════════════════════════════════════════════ */}
        <BentoCard className="col-span-12 lg:col-span-8 row-span-2 h-[600px] relative" delay={0}>
          <div className="absolute top-0 left-0 right-0 z-10 p-5 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-3 bg-white/90 backdrop-blur-2xl rounded-2xl px-5 py-3 shadow-lg pointer-events-auto border border-[#153F2D]/5">
              <div className="relative">
                <div className="absolute inset-0 bg-[#0EA5E9] rounded-full animate-ping opacity-20" />
                <Zap className="w-5 h-5 text-[#0EA5E9] relative z-10" />
              </div>
              <div>
                <p className="text-[14px] font-extrabold text-[#153F2D] leading-tight">Active Pulse</p>
                <p className="text-[10px] font-bold text-[#153F2D]/50 uppercase tracking-widest">Scanning local radius</p>
              </div>
            </div>
            
            {/* Transport Toggle */}
            <div className="bg-white/90 backdrop-blur-2xl rounded-xl p-1.5 shadow-lg border border-[#153F2D]/5 flex gap-1 pointer-events-auto">
              {(['walk', 'bike', 'drive'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setTransportMode(mode)}
                  className={`p-2 rounded-lg transition-all ${transportMode === mode ? 'bg-[#0EA5E9] text-white shadow-md' : 'text-[#153F2D]/40 hover:bg-[#153F2D]/5'}`}
                >
                  {mode === 'walk' && <Footprints className="w-4 h-4" />}
                  {mode === 'bike' && <Bike className="w-4 h-4" />}
                  {mode === 'drive' && <Truck className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          <MapGL
            {...viewState}
            onMove={evt => setViewState(evt.viewState)}
            mapStyle="mapbox://styles/mapbox/light-v11"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
            style={{ width: '100%', height: '100%' }}
            attributionControl={false}
          >
            <NavigationControl position="bottom-right" />
            
            {/* Render Pings */}
            {pings.map(ping => (
              <Marker key={ping.id} longitude={ping.lng} latitude={ping.lat} anchor="bottom">
                <div className="relative group cursor-pointer">
                  <div className={`absolute -inset-4 rounded-full opacity-20 animate-pulse ${ping.urgency === 'High' ? 'bg-[#0EA5E9]' : 'bg-[#5DB06D]'}`} />
                  <div className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-lg relative z-10 ${ping.urgency === 'High' ? 'bg-[#0EA5E9]' : 'bg-[#5DB06D]'}`}>
                    <Package className="w-4 h-4 text-white" />
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-white rounded-lg shadow-xl px-3 py-2 border border-[#153F2D]/5 text-center">
                      <p className="text-[12px] font-extrabold text-[#153F2D]">{ping.name}</p>
                      <p className="text-[10px] font-bold text-[#153F2D]/50">{ping.qty}</p>
                    </div>
                  </div>
                </div>
              </Marker>
            ))}
          </MapGL>
        </BentoCard>

        {/* ══════════════════════════════════════════════
            TILE 2: MISSION FEED (4 cols, 2 rows)
        ══════════════════════════════════════════════ */}
        <BentoCard className="col-span-12 lg:col-span-4 row-span-2 h-[600px] flex flex-col" delay={0.1}>
          <div className="p-6 border-b border-[#153F2D]/5 shrink-0">
            <h2 className="text-[18px] font-extrabold text-[#153F2D]">Rescue Opportunities</h2>
            <p className="text-[12px] font-medium text-[#153F2D]/50 mt-1">Missions near your location</p>
          </div>
          
          <div className="p-6 overflow-y-auto space-y-4 flex-1">
            {pings.map((ping) => (
              <div key={ping.id} className="rounded-2xl border border-[#153F2D]/5 bg-[#FDFBF7] p-5 hover:border-[#0EA5E9]/30 transition-colors group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-extrabold text-[#153F2D] text-[15px] group-hover:text-[#0EA5E9] transition-colors">{ping.name}</h3>
                    <p className="text-[12px] text-[#153F2D]/50 font-bold uppercase tracking-widest mt-0.5">{ping.qty}</p>
                  </div>
                  <div className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest ${
                    ping.urgency === 'High' ? 'bg-[#0EA5E9]/10 text-[#0EA5E9]' : 'bg-[#5DB06D]/10 text-[#5DB06D]'
                  }`}>
                    {ping.urgency}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-[#153F2D]/40 mb-5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold uppercase tracking-widest">{ping.distance} away</span>
                </div>

                {activeMission === ping.id ? (
                  <div className="bg-[#0EA5E9]/10 rounded-xl p-3 flex items-center justify-center gap-2 border border-[#0EA5E9]/20">
                    <Navigation className="w-4 h-4 text-[#0EA5E9]" />
                    <span className="text-[12px] font-extrabold text-[#0EA5E9] uppercase tracking-widest">Navigating</span>
                  </div>
                ) : (
                  <SwipeToAccept onAccept={() => handleAcceptMission(ping.id)} />
                )}
              </div>
            ))}
          </div>
        </BentoCard>

        {/* ══════════════════════════════════════════════
            TILE 3: IMPACT LEDGER (8 cols)
        ══════════════════════════════════════════════ */}
        <BentoCard className="col-span-12 lg:col-span-8 p-6 flex flex-col justify-between" delay={0.2}>
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-5 h-5 text-[#0EA5E9]" />
            <span className="text-[12px] font-extrabold text-[#153F2D]/40 uppercase tracking-widest">Community Karma</span>
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-[32px] font-extrabold text-[#153F2D] leading-none">42</p>
              <p className="text-[12px] font-bold text-[#153F2D]/40 uppercase tracking-widest mt-2 flex items-center gap-1"><Package className="w-3 h-3"/> Rescues</p>
            </div>
            <div>
              <p className="text-[32px] font-extrabold text-[#153F2D] leading-none">185</p>
              <p className="text-[12px] font-bold text-[#153F2D]/40 uppercase tracking-widest mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> Meals Provided</p>
            </div>
            <div>
              <p className="text-[32px] font-extrabold text-[#153F2D] leading-none">84<span className="text-[20px] text-[#153F2D]/40">kg</span></p>
              <p className="text-[12px] font-bold text-[#153F2D]/40 uppercase tracking-widest mt-2 flex items-center gap-1"><Leaf className="w-3 h-3 text-[#5DB06D]"/> CO₂ Diverted</p>
            </div>
          </div>
        </BentoCard>

        {/* ══════════════════════════════════════════════
            TILE 4: LEADERBOARD (4 cols)
        ══════════════════════════════════════════════ */}
        <BentoCard className="col-span-12 lg:col-span-4 p-6" delay={0.3}>
          <div className="flex items-center gap-2 mb-5">
            <Trophy className="w-5 h-5 text-[#EAB308]" />
            <span className="text-[12px] font-extrabold text-[#153F2D]/40 uppercase tracking-widest">Local Top 3</span>
          </div>
          <div className="space-y-4">
            {[
              { rank: 1, name: 'Sarah J.', score: 2450 },
              { rank: 2, name: 'You', score: 1850, isYou: true },
              { rank: 3, name: 'Mike R.', score: 1200 },
            ].map((user) => (
              <div key={user.rank} className={`flex items-center justify-between p-3 rounded-xl ${user.isYou ? 'bg-[#0EA5E9]/5 border border-[#0EA5E9]/20' : 'bg-[#153F2D]/5'}`}>
                <div className="flex items-center gap-3">
                  <span className={`text-[12px] font-extrabold ${user.rank === 1 ? 'text-[#EAB308]' : 'text-[#153F2D]/40'}`}>#{user.rank}</span>
                  <span className={`text-[14px] font-extrabold ${user.isYou ? 'text-[#0EA5E9]' : 'text-[#153F2D]'}`}>{user.name}</span>
                </div>
                <span className="text-[12px] font-bold text-[#153F2D]/60">{user.score} pts</span>
              </div>
            ))}
          </div>
        </BentoCard>

      </div>
    </div>
  )
}

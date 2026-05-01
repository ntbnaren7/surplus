"use client"

import { useDriver } from "@/hooks/useDriver"
import { getHoursUntilExpiry } from "@/utils/time"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { MapPin, Navigation2, CheckCircle2, AlertTriangle, Route } from "lucide-react"

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 28 } },
}

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

export function DriverDashboardModule() {
  const { activeRuns, completeDelivery } = useDriver()

  return (
    <motion.div
      className="grid lg:grid-cols-5 gap-8 max-w-[1200px] mx-auto pt-8"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* Route List */}
      <motion.div variants={fadeUp} className="lg:col-span-2 space-y-6">
        <div>
          <h2 className="text-[20px] font-bold tracking-[-0.02em] text-[#1A3C34]">Route Queue</h2>
          <p className="text-[13px] text-[#1A3C34]/60 mt-1">Multi-stop paths ordered by expiry urgency.</p>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {activeRuns.map((item, index) => {
              const hoursToExpiry = getHoursUntilExpiry(item.expiresAt)
              const isUrgent = hoursToExpiry < 2

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className={`rounded-2xl bg-white/80 backdrop-blur-xl shadow-glass ring-1 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${isUrgent ? 'ring-red-500/30 bg-red-50/50' : 'ring-[#1A3C34]/10'}`}>
                    <div className="flex items-start gap-4">
                      {/* Step indicator */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-[14px] font-bold font-mono ${isUrgent ? 'bg-red-500 text-white shadow-[0_4px_12px_rgba(239,68,68,0.4)]' : 'bg-[#1A3C34] text-white shadow-sm'}`}>
                        {index + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[15px] font-bold text-[#1A3C34] truncate">{item.name}</p>
                          {isUrgent && <AlertTriangle className="w-4 h-4 text-red-500 animate-breathe shrink-0" />}
                        </div>
                        <div className="flex items-center gap-2 text-[12px] text-[#1A3C34]/60 mb-4 font-mono">
                          <span>{hoursToExpiry}h left</span>
                          <span className="text-[#1A3C34]/20">•</span>
                          <span>{item.quantity} {item.unit}</span>
                        </div>
                        <Button
                          onClick={() => completeDelivery(item.id)}
                          className="w-full bg-[#F5F0EB] hover:bg-[#1A3C34] text-[#1A3C34] hover:text-white border border-[#1A3C34]/10 transition-all font-bold tracking-wide uppercase text-[11px] py-4 rounded-xl shadow-sm"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Mark Delivered
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
          {activeRuns.length === 0 && (
            <div className="py-20 text-center rounded-[2rem] border border-dashed border-[#1A3C34]/20 bg-white/30 backdrop-blur-md">
              <Route className="w-10 h-10 text-[#1A3C34]/20 mx-auto mb-4" />
              <p className="text-[15px] font-medium text-[#1A3C34]/60">No active runs assigned.</p>
              <p className="text-[12px] text-[#1A3C34]/40 mt-1">Wait for dispatch alerts.</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Map View */}
      <motion.div variants={fadeUp} className="lg:col-span-3">
        <div className="rounded-[2rem] bg-white/80 backdrop-blur-xl shadow-glass ring-1 ring-[#1A3C34]/10 h-[640px] relative overflow-hidden flex flex-col">
          {/* Map header overlay */}
          <div className="p-5 flex justify-between items-center bg-white/60 backdrop-blur-md absolute top-0 w-full z-10 border-b border-[#1A3C34]/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2D7A3A]/10 flex items-center justify-center">
                <Navigation2 className="w-5 h-5 text-[#2D7A3A]" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-[#1A3C34]">Turn-by-Turn</p>
                <p className="text-[11px] text-[#1A3C34]/60 font-mono">Multi-stop optimized</p>
              </div>
            </div>
            <Badge variant="outline" className="font-mono bg-white text-[#1A3C34] border-[#1A3C34]/10 shadow-sm px-3 py-1 text-[12px]">
              {activeRuns.length} stops
            </Badge>
          </div>

          {/* Map body - High-End Simulation */}
          <div className="flex-1 bg-[#F5F0EB] flex items-center justify-center relative overflow-hidden">
            {/* Very faint map-like grid/texture for premium feel */}
            <div className="absolute inset-0 glass-noise opacity-50" />
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(#1A3C34 0.5px, transparent 0.5px)',
              backgroundSize: '24px 24px',
              opacity: 0.05
            }} />
            
            {/* Simulated route dots */}
            <div className="absolute inset-0">
              {activeRuns.length > 0 && (
                <>
                  <div className="absolute top-1/3 left-1/4 w-4 h-4 rounded-full bg-[#1A3C34]/20 animate-ping" />
                  <div className="absolute top-1/3 left-1/4 w-3 h-3 rounded-full bg-[#1A3C34] ring-2 ring-white shadow-sm" />
                  
                  <div className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-[#2D7A3A]/20 animate-ping" style={{ animationDelay: "0.5s" }} />
                  <div className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-[#2D7A3A] ring-2 ring-white shadow-sm" />
                  
                  <div className="absolute top-2/3 right-1/3 w-4 h-4 rounded-full bg-red-500/20 animate-ping" style={{ animationDelay: "1s" }} />
                  <div className="absolute top-2/3 right-1/3 w-3 h-3 rounded-full bg-red-500 ring-2 ring-white shadow-sm" />
                  
                  {/* Simulated route line */}
                  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <line x1="25%" y1="33%" x2="50%" y2="50%" stroke="#1A3C34" strokeOpacity="0.2" strokeWidth="2" strokeDasharray="6 6" />
                    <line x1="50%" y1="50%" x2="67%" y2="67%" stroke="#1A3C34" strokeOpacity="0.2" strokeWidth="2" strokeDasharray="6 6" />
                  </svg>
                </>
              )}
            </div>

            {/* Center label */}
            <div className="text-center z-10 bg-white/90 p-8 rounded-3xl shadow-glass ring-1 ring-[#1A3C34]/10 backdrop-blur-2xl">
              <div className="w-12 h-12 rounded-full bg-[#1A3C34]/5 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-[#1A3C34]/40" />
              </div>
              <h3 className="text-[16px] font-bold text-[#1A3C34] mb-2">Live Routing</h3>
              <p className="text-[13px] text-[#1A3C34]/60 max-w-[200px] leading-relaxed mx-auto">
                Mapbox GL renders dynamic, traffic-aware routes here in production.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

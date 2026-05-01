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
      className="grid lg:grid-cols-5 gap-6"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* Route List */}
      <motion.div variants={fadeUp} className="lg:col-span-2 space-y-6">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Route Queue</h2>
          <p className="text-[13px] text-muted-foreground mt-0.5">Ordered by expiry urgency.</p>
        </div>

        <div className="space-y-2">
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
                  <div className={`glow-border rounded-xl border bg-white/[0.02] p-4 transition-all duration-300 hover:bg-white/[0.04] ${isUrgent ? 'border-red-500/20' : 'border-white/[0.06]'}`}>
                    <div className="flex items-start gap-3.5">
                      {/* Step indicator */}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold font-mono ${isUrgent ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-blue-500/[0.08] text-blue-400 border border-blue-500/10'}`}>
                        {index + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[14px] font-medium text-foreground truncate">{item.name}</p>
                          {isUrgent && <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-breathe shrink-0" />}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                          <span className="font-mono">{hoursToExpiry}h left</span>
                          <span className="text-white/10">·</span>
                          <span>Donor {index + 1} → Shelter A</span>
                        </div>
                        <Button
                          onClick={() => completeDelivery(item.id)}
                          variant="outline"
                          size="sm"
                          className="w-full h-8 text-xs"
                        >
                          <CheckCircle2 className="w-3 h-3" />
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
            <div className="py-16 text-center rounded-2xl border border-dashed border-white/[0.06]">
              <Route className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No active runs assigned.</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Map View */}
      <motion.div variants={fadeUp} className="lg:col-span-3">
        <div className="glow-border rounded-2xl border border-white/[0.06] bg-white/[0.02] h-[640px] relative overflow-hidden flex flex-col">
          {/* Map header overlay */}
          <div className="p-4 flex justify-between items-center bg-black/60 backdrop-blur-xl absolute top-0 w-full z-10 border-b border-white/[0.04]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/[0.08] border border-blue-500/10 flex items-center justify-center">
                <Navigation2 className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-foreground">Turn-by-Turn</p>
                <p className="text-[11px] text-muted-foreground font-mono">Multi-stop optimized</p>
              </div>
            </div>
            <Badge variant="secondary" className="font-mono">
              {activeRuns.length} stops
            </Badge>
          </div>

          {/* Map body */}
          <div className="flex-1 bg-[#050505] flex items-center justify-center relative">
            {/* Simulated map grid */}
            <div className="absolute inset-0 bg-grid opacity-40" />
            {/* Simulated route dots */}
            <div className="absolute inset-0">
              {activeRuns.length > 0 && (
                <>
                  <div className="absolute top-1/3 left-1/4 w-3 h-3 rounded-full bg-blue-400/60 animate-ping" />
                  <div className="absolute top-1/3 left-1/4 w-2 h-2 rounded-full bg-blue-400" />
                  <div className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-emerald-400/60 animate-ping" style={{ animationDelay: "0.5s" }} />
                  <div className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-emerald-400" />
                  <div className="absolute top-2/3 right-1/3 w-3 h-3 rounded-full bg-amber-400/60 animate-ping" style={{ animationDelay: "1s" }} />
                  <div className="absolute top-2/3 right-1/3 w-2 h-2 rounded-full bg-amber-400" />
                  {/* Simulated route line */}
                  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <line x1="25%" y1="33%" x2="50%" y2="50%" stroke="rgba(96,165,250,0.2)" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="50%" y1="50%" x2="67%" y2="67%" stroke="rgba(96,165,250,0.2)" strokeWidth="1" strokeDasharray="4 4" />
                  </svg>
                </>
              )}
            </div>
            {/* Center label */}
            <div className="text-center z-10 bg-black/70 p-6 rounded-2xl backdrop-blur-xl border border-white/[0.06]">
              <MapPin className="w-6 h-6 text-blue-400/40 mx-auto mb-3" />
              <h3 className="text-[14px] font-semibold text-foreground mb-1">Live Map</h3>
              <p className="text-[12px] text-muted-foreground max-w-[200px] leading-relaxed">
                Mapbox GL renders optimized routes here in production.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

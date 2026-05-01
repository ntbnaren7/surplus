"use client"

import { useReceiver } from "@/hooks/useReceiver"
import { getHoursUntilExpiry } from "@/utils/time"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { Clock, Navigation, CheckCircle2, Package, Truck, Zap } from "lucide-react"

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 28 } },
}

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

export function ReceiverDashboardModule() {
  const { availableItems, incomingItems, claimSurplus } = useReceiver()

  return (
    <motion.div
      className="space-y-12 max-w-[1200px] mx-auto pt-8"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* Real-time Match Feed */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#1A3C34]">Surplus Feed</h2>
            <p className="text-[14px] text-[#1A3C34]/60 mt-1">AI-matched to your location and capacity.</p>
          </div>
          <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md px-4 py-2 rounded-full ring-1 ring-[#1A3C34]/10 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2D7A3A] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2D7A3A]" />
            </span>
            <span className="text-[12px] font-bold text-[#1A3C34] uppercase tracking-wider">Live Radar</span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {availableItems.map((item) => {
              const hoursToExpiry = getHoursUntilExpiry(item.expiresAt)
              const isUrgent = hoursToExpiry <= 3
              const isCritical = item.priorityScore >= 150

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className={`relative overflow-hidden rounded-[2rem] bg-white/80 backdrop-blur-xl shadow-glass ring-1 p-6 flex flex-col transition-all duration-300 hover:shadow-[0_8px_30px_rgba(26,60,52,0.1)] hover:-translate-y-1 ${isCritical ? 'ring-red-500/30' : isUrgent ? 'ring-orange-500/30' : 'ring-[#1A3C34]/10'}`}>
                    
                    {/* Urgency Highlight Background */}
                    {isCritical && <div className="absolute inset-0 bg-red-500/5 pointer-events-none" />}
                    
                    <div className="flex items-start justify-between mb-6 relative z-10">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isCritical ? 'bg-red-500/10' : 'bg-[#1A3C34]/5'}`}>
                          {isCritical ? <Zap className="w-5 h-5 text-red-500" /> : <Package className="w-5 h-5 text-[#1A3C34]/60" />}
                        </div>
                        <div>
                          <p className="text-[16px] font-bold text-[#1A3C34]">{item.name}</p>
                          <p className="text-[12px] text-[#1A3C34]/60 font-mono mt-0.5">{item.quantity} {item.unit}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-5 mb-8 text-[13px] text-[#1A3C34]/70 relative z-10">
                      <div className="flex items-center gap-1.5 font-mono">
                        <Clock className="w-4 h-4 text-[#1A3C34]/40" />
                        <span>{hoursToExpiry}h left</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono">
                        <Navigation className="w-4 h-4 text-[#1A3C34]/40" />
                        <span>{item.distance} km</span>
                      </div>
                      
                      <div className="ml-auto">
                        {isCritical ? (
                          <Badge variant="destructive" className="animate-breathe bg-red-500 text-white border-none text-[10px] px-2.5 py-0.5 uppercase tracking-wider shadow-[0_0_12px_rgba(239,68,68,0.5)]">Critical</Badge>
                        ) : isUrgent ? (
                          <Badge variant="secondary" className="animate-breathe bg-orange-500 text-white border-none text-[10px] px-2.5 py-0.5 uppercase tracking-wider">Urgent</Badge>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-auto relative z-10">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A3C34]/40">AI Priority Score</span>
                        <span className="text-[12px] font-mono font-bold text-[#2D7A3A]">{item.priorityScore}</span>
                      </div>
                      <Button
                        onClick={() => claimSurplus(item.id)}
                        className={`w-full py-6 rounded-xl text-[14px] font-bold tracking-wide uppercase shadow-sm transition-all ${isCritical ? 'bg-red-500 hover:bg-red-600 shadow-[0_4px_20px_rgba(239,68,68,0.3)] text-white' : 'bg-[#1A3C34] hover:bg-[#152E28] text-white'}`}
                      >
                        Claim & Dispatch
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
          {availableItems.length === 0 && (
            <div className="col-span-full py-20 text-center rounded-[2rem] border border-dashed border-[#1A3C34]/20 bg-white/30 backdrop-blur-md">
              <Package className="w-10 h-10 text-[#1A3C34]/20 mx-auto mb-4" />
              <p className="text-[15px] font-medium text-[#1A3C34]/60">Scanning nearby donors…</p>
              <p className="text-[12px] text-[#1A3C34]/40 mt-1">Your feed will update automatically.</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Incoming Deliveries */}
      <motion.div variants={fadeUp}>
        <div className="mb-8">
          <h2 className="text-[20px] font-bold tracking-[-0.02em] text-[#1A3C34]">Incoming Deliveries</h2>
          <p className="text-[14px] text-[#1A3C34]/60 mt-1">Track drivers en route to your facility.</p>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {incomingItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="flex items-center justify-between p-5 rounded-2xl bg-white/80 backdrop-blur-md ring-1 ring-[#1A3C34]/10 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-[#2D7A3A]/10 flex items-center justify-center">
                      <Truck className="w-5 h-5 text-[#2D7A3A]" />
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-[#1A3C34]">{item.name}</p>
                      <p className="text-[13px] text-[#1A3C34]/60 mt-0.5">
                        <span className="font-mono">{item.quantity} {item.unit}</span>
                        <span className="mx-2 text-[#1A3C34]/20">|</span>
                        Driver: Alex M.
                        <span className="mx-2 text-[#1A3C34]/20">|</span>
                        <span className="font-mono font-bold text-[#2D7A3A]">ETA 12 min</span>
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-[#1A3C34]/5 text-[#1A3C34] hover:bg-[#1A3C34]/10 border-none font-bold tracking-wide">In Transit</Badge>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {incomingItems.length === 0 && (
            <div className="py-12 text-center text-[13px] font-medium text-[#1A3C34]/40 bg-white/40 rounded-2xl border border-[#1A3C34]/5">
              No incoming deliveries right now.
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

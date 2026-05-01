"use client"

import { useReceiver } from "@/hooks/useReceiver"
import { getHoursUntilExpiry } from "@/utils/time"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { Clock, Navigation, CheckCircle2, Package, Truck, Zap, Activity } from "lucide-react"

import Image from "next/image"

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
      className="space-y-10 max-w-[1200px] mx-auto pt-0 -mt-6"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* ── Top Bar: Radar Status ── */}
      <motion.div variants={fadeUp} className="flex justify-end mb-4">
        <div className="flex items-center gap-4 bg-white/40 backdrop-blur-3xl border border-[#153F2D]/5 shadow-sm rounded-full pl-3 pr-4 py-1.5 hover:bg-white/60 transition-all">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5DB06D] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5DB06D]"></span>
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#153F2D]/70">Live Radar</span>
          </div>
          <div className="h-4 w-px bg-[#153F2D]/10 mx-1" />
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#153F2D]">
            <span>Scanning 5km Radius</span>
          </div>
        </div>
      </motion.div>

      {/* Real-time Match Feed */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[20px] font-extrabold tracking-[-0.02em] text-[#153F2D]">Surplus Feed</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {availableItems.map((item) => {
              const hoursToExpiry = getHoursUntilExpiry(item.expiresAt)
              const isUrgent = hoursToExpiry <= 3
              const isCritical = item.priorityScore >= 150
              
              // Calculate confidence width (max score ~200)
              const confidenceWidth = Math.min(100, Math.max(0, (item.priorityScore / 200) * 100));

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -12 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="group"
                >
                  <div className={`relative overflow-hidden rounded-[2rem] bg-white/80 backdrop-blur-xl border border-[#153F2D]/5 shadow-sm p-6 flex flex-col transition-all duration-300 hover:shadow-[0_16px_32px_-12px_rgba(21,63,45,0.08)] hover:-translate-y-1 ${isCritical ? 'bg-red-50/20' : ''}`}>
                    
                    {/* Urgency Highlight Background */}
                    {isCritical && <div className="absolute inset-0 bg-red-500/5 pointer-events-none" />}
                    
                    {/* Food Image Header */}
                    {item.imageUrl && (
                      <div className="relative h-40 w-full rounded-2xl overflow-hidden mb-5 -mt-2 -mx-0 shadow-inner">
                        <Image 
                          src={item.imageUrl} 
                          alt={item.name} 
                          fill 
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                        
                        {/* Status overlays on image */}
                        <div className="absolute top-3 right-3">
                          {isCritical ? (
                            <span className="bg-[#D9534F] text-white text-[10px] px-2.5 py-1 rounded-lg uppercase tracking-widest font-extrabold shadow-sm border border-white/20 relative overflow-hidden flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                              Critical
                            </span>
                          ) : isUrgent ? (
                            <span className="bg-[#F0AD4E] text-white text-[10px] px-2.5 py-1 rounded-lg uppercase tracking-widest font-extrabold shadow-sm border border-white/20">Urgent</span>
                          ) : null}
                        </div>
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-5 relative z-10">
                      <div className="flex items-center gap-4">
                        {!item.imageUrl && (
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isCritical ? 'bg-red-500/10' : 'bg-[#153F2D]/5'}`}>
                            {isCritical ? <Zap className="w-5 h-5 text-red-500" /> : <Package className="w-5 h-5 text-[#153F2D]/40" />}
                          </div>
                        )}
                        <div>
                          <p className="text-[18px] font-extrabold text-[#153F2D] leading-tight tracking-[-0.01em]">{item.name}</p>
                          <p className="text-[12px] font-bold text-[#153F2D]/50 uppercase tracking-widest mt-1.5">{item.quantity} {item.unit}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-6 text-[12px] font-bold text-[#153F2D]/60 relative z-10">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{hoursToExpiry}h left</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5" />
                        <span>{item.distance} km</span>
                      </div>
                    </div>

                    <div className="mt-auto relative z-10 space-y-4">
                      {/* Confidence Bar */}
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#153F2D]/40">AI Match Confidence</span>
                          <span className="text-[11px] font-bold text-[#5DB06D]">{Math.round(confidenceWidth)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#153F2D]/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#5DB06D] to-[#153F2D] rounded-full transition-all duration-1000"
                            style={{ width: `${confidenceWidth}%` }}
                          />
                        </div>
                      </div>

                      <Button
                        onClick={() => claimSurplus(item.id)}
                        className={`w-full py-5 rounded-[1.25rem] text-[13px] font-extrabold tracking-widest uppercase transition-all flex items-center justify-center gap-2 group/btn ${isCritical ? 'bg-[#D9534F] hover:bg-[#c9302c] shadow-[0_8px_16px_rgba(217,83,79,0.3)] text-white' : 'bg-[#153F2D] hover:bg-[#113123] shadow-[0_8px_16px_rgba(21,63,45,0.2)] text-white'}`}
                      >
                        Claim & Dispatch
                        <Truck className="w-4 h-4 opacity-70 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
          {availableItems.length === 0 && (
            <div className="col-span-full py-20 text-center rounded-[2rem] border border-dashed border-[#153F2D]/10 bg-white/40 backdrop-blur-3xl shadow-sm">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#153F2D]/5 shadow-sm">
                <Activity className="w-6 h-6 text-[#153F2D]/20 animate-pulse" />
              </div>
              <p className="text-[15px] font-extrabold text-[#153F2D]/60">Scanning nearby donors…</p>
              <p className="text-[13px] font-medium text-[#153F2D]/40 mt-1">Your feed will update automatically.</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Incoming Deliveries */}
      <motion.div variants={fadeUp} className="bg-white/40 backdrop-blur-3xl border border-[#153F2D]/5 shadow-[0_32px_64px_-12px_rgba(21,63,45,0.05)] rounded-[2.5rem] p-8">
        <div className="mb-8">
          <h2 className="text-[20px] font-extrabold tracking-[-0.02em] text-[#153F2D]">Incoming Deliveries</h2>
          <p className="text-[14px] text-[#153F2D]/60 mt-1 font-medium">Track drivers en route to your facility.</p>
        </div>

        <div className="space-y-4">
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
                <div className="flex items-center justify-between p-6 rounded-[1.5rem] bg-white border border-[#153F2D]/5 shadow-sm hover:shadow-[0_8px_24px_-8px_rgba(21,63,45,0.08)] transition-all">
                  <div className="flex items-center gap-6">
                    {/* Animated Truck Icon */}
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-[#5DB06D]/10 flex items-center justify-center relative z-10 border border-[#5DB06D]/20">
                        <Truck className="w-6 h-6 text-[#5DB06D]" />
                      </div>
                      <div className="absolute inset-0 bg-[#5DB06D]/20 rounded-full animate-ping opacity-50" />
                    </div>
                    
                    <div>
                      <p className="text-[16px] font-extrabold text-[#153F2D] mb-1">{item.name}</p>
                      <div className="flex items-center gap-3 text-[13px] text-[#153F2D]/60 font-bold">
                        <span className="uppercase tracking-widest">{item.quantity} {item.unit}</span>
                        <div className="w-1 h-1 rounded-full bg-[#153F2D]/20" />
                        <span className="text-[#153F2D]/80">Alex M.</span>
                        <div className="w-1 h-1 rounded-full bg-[#153F2D]/20" />
                        <span className="text-[#5DB06D] font-extrabold">ETA 12 MIN</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                     <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5DB06D]/10 text-[#5DB06D] text-[11px] font-extrabold uppercase tracking-widest">
                       <span className="w-1.5 h-1.5 rounded-full bg-[#5DB06D] animate-pulse" />
                       In Transit
                     </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {incomingItems.length === 0 && (
            <div className="py-16 text-center">
              <Truck className="w-8 h-8 text-[#153F2D]/10 mx-auto mb-3" />
              <p className="text-[14px] font-bold text-[#153F2D]/40">No incoming deliveries right now.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

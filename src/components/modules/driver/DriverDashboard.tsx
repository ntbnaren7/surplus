"use client"

import { useDriver } from "@/hooks/useDriver"
import { getHoursUntilExpiry } from "@/utils/time"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { MapPin, Navigation2, CheckCircle2, AlertTriangle, Route, Clock, Scan } from "lucide-react"
import Image from "next/image"

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
      className="space-y-6 max-w-[1200px] mx-auto pt-0"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <div className="grid lg:grid-cols-12 gap-8 relative">
        
        {/* Route List / Opportunity Feed */}
        <div className="lg:col-span-5 flex flex-col h-[700px]">
          <motion.div variants={fadeUp} className="mb-6">
            <h2 className="text-[36px] font-extrabold text-[#153F2D] tracking-[-0.03em] mb-3">Active Missions</h2>
            <p className="text-[15px] text-[#153F2D]/60 leading-relaxed max-w-[300px]">Multi-stop paths ordered by expiry urgency and AI priority.</p>
          </motion.div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-5">
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
                      className="group"
                    >
                      <div className={`relative overflow-hidden rounded-[2rem] bg-white/80 backdrop-blur-xl border border-[#153F2D]/5 shadow-sm p-5 flex flex-col transition-all duration-300 hover:shadow-[0_16px_32px_-12px_rgba(21,63,45,0.08)] hover:-translate-y-1 ${isUrgent ? 'bg-red-50/20' : ''}`}>
                        
                        {/* Food Image Header */}
                        {item.imageUrl && (
                          <div className="relative h-24 w-full rounded-xl overflow-hidden mb-4 -mt-1 shadow-inner">
                            <Image 
                              src={item.imageUrl} 
                              alt={item.name} 
                              fill 
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                            
                            {/* Step & Urgent Overlays */}
                            <div className="absolute top-2 left-2 flex gap-2">
                               <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-extrabold shadow-sm ${isUrgent ? 'bg-[#D9534F] text-white' : 'bg-white text-[#153F2D]'}`}>
                                 {index + 1}
                               </div>
                            </div>
                            <div className="absolute top-2 right-2">
                              {isUrgent && (
                                <span className="bg-[#D9534F] text-white text-[9px] px-2 py-0.5 rounded-md uppercase tracking-widest font-extrabold shadow-sm border border-white/20 relative overflow-hidden flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                  Urgent
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex-1 min-w-0 mb-4">
                          {!item.imageUrl && (
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-[12px] font-extrabold mb-3 shadow-sm ${isUrgent ? 'bg-[#D9534F] text-white' : 'bg-[#153F2D]/5 text-[#153F2D]'}`}>
                              {index + 1}
                            </div>
                          )}
                          <div className="flex items-start justify-between mb-1">
                            <p className="text-[18px] font-extrabold text-[#153F2D] tracking-tight">{item.name}</p>
                          </div>
                          <div className="flex items-center gap-3 text-[12px] text-[#153F2D]/60 mt-1 font-bold">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{hoursToExpiry}h left</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-[#153F2D]/20" />
                            <span className="uppercase tracking-widest text-[#153F2D]">{item.quantity} {item.unit}</span>
                          </div>
                        </div>

                        <Button
                          onClick={() => completeDelivery(item.id)}
                          className="w-full bg-[#153F2D] hover:bg-[#113123] shadow-[0_8px_16px_rgba(21,63,45,0.2)] text-white transition-all font-extrabold tracking-widest uppercase text-[12px] py-5 rounded-[1.25rem]"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2 opacity-70" />
                          Mark Delivered
                        </Button>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
              {activeRuns.length === 0 && (
                <div className="py-24 text-center rounded-[2.5rem] border border-dashed border-[#153F2D]/10 bg-white/40 backdrop-blur-3xl shadow-sm">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#153F2D]/5 shadow-sm">
                    <Scan className="w-6 h-6 text-[#153F2D]/20 animate-pulse" />
                  </div>
                  <p className="text-[15px] font-extrabold text-[#153F2D]/60">No active runs assigned.</p>
                  <p className="text-[13px] font-medium text-[#153F2D]/40 mt-1">Wait for dispatch alerts to appear.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Central Radar / Mission Map ── */}
        <motion.div variants={fadeUp} className="lg:col-span-7 h-[700px] lg:-mt-[5.5rem] relative">
          
          {/* ── Top Bar: Logistics Status (Now isolated to map column) ── */}
          <div className="flex justify-end mb-4">
            <div className="flex items-center gap-4 bg-white/40 backdrop-blur-3xl border border-[#153F2D]/5 shadow-sm rounded-full pl-3 pr-4 py-1.5 hover:bg-white/60 transition-all">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EAB308] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EAB308]"></span>
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#153F2D]/70">Fleet Active</span>
              </div>
              <div className="h-4 w-px bg-[#153F2D]/10 mx-1" />
              <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#153F2D]">
                <span>Online</span>
              </div>
            </div>
          </div>

          <div className="rounded-[3rem] bg-white/40 backdrop-blur-[60px] shadow-[0_32px_64px_-12px_rgba(21,63,45,0.05)] border border-[#153F2D]/5 h-full relative overflow-hidden flex flex-col">
            
            {/* Map Header */}
            <div className="p-6 flex justify-between items-center bg-white/60 backdrop-blur-3xl absolute top-0 w-full z-10 border-b border-[#153F2D]/5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EAB308]/10 flex items-center justify-center border border-[#EAB308]/20">
                  <Navigation2 className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div>
                  <p className="text-[16px] font-extrabold text-[#153F2D] leading-tight">Dynamic Routing</p>
                  <p className="text-[12px] font-bold text-[#153F2D]/60 uppercase tracking-widest mt-0.5">Optimizing 5km Radius</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[12px] font-bold text-[#153F2D]/70 bg-white px-4 py-2 rounded-full border border-[#153F2D]/5 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-[#EAB308]" />
                {activeRuns.length} Stops Remaining
              </div>
            </div>

            {/* Map Body Simulation */}
            <div className="flex-1 bg-[#FDFBF7] flex items-center justify-center relative overflow-hidden">
              {/* Minimalist Grid Pattern */}
              <div className="absolute inset-0" style={{
                backgroundImage: 'linear-gradient(to right, #153F2D06 1px, transparent 1px), linear-gradient(to bottom, #153F2D06 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }} />
              
              {/* Radar Rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-[#153F2D]/5" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-[#153F2D]/5" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-[#153F2D]/5" />

              {/* Simulated route elements */}
              <div className="absolute inset-0 z-10">
                {activeRuns.length > 0 && (
                  <>
                    <div className="absolute top-1/3 left-1/4 w-8 h-8 rounded-full bg-[#D9534F]/10 flex items-center justify-center animate-pulse">
                      <div className="w-3 h-3 rounded-full bg-[#D9534F] ring-4 ring-white shadow-sm" />
                    </div>
                    
                    <div className="absolute top-1/2 left-1/2 w-8 h-8 rounded-full bg-[#5DB06D]/10 flex items-center justify-center" style={{ animationDelay: "0.5s" }}>
                      <div className="w-4 h-4 rounded-full bg-[#5DB06D] ring-4 ring-white shadow-sm" />
                    </div>
                    
                    <div className="absolute top-[60%] right-1/3 w-8 h-8 rounded-full bg-[#EAB308]/10 flex items-center justify-center animate-pulse" style={{ animationDelay: "1s" }}>
                      <div className="w-3 h-3 rounded-full bg-[#EAB308] ring-4 ring-white shadow-sm" />
                    </div>
                    
                    {/* Simulated route line */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M 25% 33% Q 40% 40% 50% 50% T 66% 60%" fill="none" stroke="#EAB308" strokeOpacity="0.4" strokeWidth="3" strokeDasharray="8 8" className="animate-dash" />
                    </svg>
                  </>
                )}
              </div>

              {/* Center Map Placeholder text */}
              <div className="relative z-20 bg-white/90 px-8 py-6 rounded-[2rem] shadow-sm border border-[#153F2D]/5 backdrop-blur-2xl text-center max-w-[280px]">
                <div className="w-14 h-14 rounded-2xl bg-white border border-[#153F2D]/5 shadow-sm flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-[#153F2D]/30" />
                </div>
                <h3 className="text-[18px] font-extrabold text-[#153F2D] mb-1.5">Live Navigation</h3>
                <p className="text-[13px] font-medium text-[#153F2D]/50 leading-relaxed">
                  Mapbox GL will render traffic-aware, multi-stop optimized routes here.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

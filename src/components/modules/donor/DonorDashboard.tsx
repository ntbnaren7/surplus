"use client"

import { useState } from "react"
import { useDonor } from "@/hooks/useDonor"
import { getHoursUntilExpiry } from "@/utils/time"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { Clock, Plus, Zap, Package, Send, Activity } from "lucide-react"

import Image from "next/image"

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 28 } },
}

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

export function DonorDashboardModule() {
  const { activeSurplus, simulateDrop, submitManualDrop } = useDonor()
  
  // Form State for Quick-Drop
  const [name, setName] = useState("Mixed Buffet Leftovers")
  const [quantity, setQuantity] = useState("2")
  const [unit, setUnit] = useState<'portions' | 'pieces' | 'kg'>('kg')
  const [expiryHours, setExpiryHours] = useState<number>(3)

  const handleManualDrop = (e: React.FormEvent) => {
    e.preventDefault();
    submitManualDrop(name, parseInt(quantity) || 1, unit, expiryHours);
    // Reset form briefly or show success
  }

  return (
    <motion.div
      className="space-y-6 max-w-[1100px] mx-auto pt-0 -mt-6"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* ── Top Bar: POS Status ── */}
      <motion.div variants={fadeUp} className="flex justify-end mb-2">
        <div className="flex items-center gap-4 bg-white/40 backdrop-blur-3xl border border-[#153F2D]/5 shadow-sm rounded-full pl-3 pr-2 py-1.5 cursor-pointer hover:bg-white/60 transition-all group" onClick={simulateDrop}>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5DB06D] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5DB06D]"></span>
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#153F2D]/70">POS Live Sync</span>
          </div>
          <div className="h-4 w-px bg-[#153F2D]/10 mx-1" />
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#153F2D]">
            <span>Square & Toast</span>
            <div className="bg-[#153F2D]/5 rounded-full p-1 group-hover:bg-[#153F2D]/10 transition-colors">
              <Plus className="w-3 h-3 text-[#153F2D]" />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* ── Left Column: Command Center (Form) ── */}
        <div className="lg:col-span-5 space-y-10">
          <motion.div variants={fadeUp}>
            <h2 className="text-[36px] font-extrabold text-[#153F2D] tracking-[-0.03em] mb-3">Log Surplus</h2>
            <p className="text-[15px] text-[#153F2D]/60 leading-relaxed max-w-[300px]">Broadcast untracked food to the receiver network instantly.</p>
          </motion.div>
          
          <form onSubmit={handleManualDrop} className="space-y-10">
            <div className="space-y-8">
              {/* Item Name (Ghost Input) */}
              <div className="relative group">
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="What are you donating?"
                  className="w-full bg-transparent border-b-2 border-[#153F2D]/10 pb-3 text-[22px] font-bold text-[#153F2D] placeholder:text-[#153F2D]/20 focus:outline-none focus:border-[#5DB06D] transition-colors"
                />
              </div>

              {/* Quantity & Unit */}
              <div className="flex items-end gap-6">
                <div className="relative flex-1 group">
                  <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#153F2D]/40 mb-1 block">Amount</label>
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-transparent border-b-2 border-[#153F2D]/10 pb-2 text-[18px] font-bold text-[#153F2D] focus:outline-none focus:border-[#5DB06D] transition-colors"
                  />
                </div>
                <div className="relative flex-1 group">
                  <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#153F2D]/40 mb-1 block">Unit</label>
                  <select 
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as any)}
                    className="w-full bg-transparent border-b-2 border-[#153F2D]/10 pb-2 text-[18px] font-bold text-[#153F2D] focus:outline-none focus:border-[#5DB06D] transition-colors appearance-none cursor-pointer"
                  >
                    <option value="kg">Trays / Kg</option>
                    <option value="portions">Portions</option>
                    <option value="pieces">Pieces</option>
                  </select>
                </div>
              </div>

              {/* Shelf Life (Pills) */}
              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#153F2D]/40 mb-4 block">Shelf Life</label>
                <div className="flex gap-3">
                  {[
                    { label: '1 Hr', value: 1 },
                    { label: '3 Hrs', value: 3 },
                    { label: 'EOD', value: 12 }
                  ].map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setExpiryHours(preset.value)}
                      className={`flex-1 py-3.5 rounded-2xl text-[13px] font-bold transition-all border ${
                        expiryHours === preset.value 
                          ? 'bg-[#153F2D] text-white border-[#153F2D] shadow-[0_8px_16px_rgba(21,63,45,0.2)]' 
                          : 'bg-white/40 text-[#153F2D]/60 border-[#153F2D]/10 hover:bg-white/80'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Broadcast Button */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="w-full relative group overflow-hidden bg-[#5DB06D] text-white rounded-[1.5rem] py-5 shadow-[0_16px_32px_-8px_rgba(93,176,109,0.4)] transition-all flex items-center justify-center gap-3"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
              <span className="text-[15px] font-extrabold tracking-widest uppercase">Broadcast</span>
              <Activity className="w-5 h-5" />
            </motion.button>
          </form>
        </div>

        {/* ── Right Column: Active Feed (Timeline) ── */}
        <div className="lg:col-span-7">
          <motion.div variants={fadeUp} className="bg-white/40 backdrop-blur-[60px] border border-[#153F2D]/5 shadow-[0_32px_64px_-12px_rgba(21,63,45,0.05)] rounded-[2.5rem] p-8 h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-8 shrink-0">
              <h3 className="text-[20px] font-extrabold text-[#153F2D]">Active Feed</h3>
              <div className="flex items-center gap-2 text-[12px] font-bold text-[#153F2D]/70 bg-white/50 px-4 py-1.5 rounded-full border border-[#153F2D]/5">
                <div className="w-2 h-2 rounded-full bg-[#5DB06D]" />
                {activeSurplus.length} Routing
              </div>
            </div>

            {/* Scrollable Feed Container */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-gradient-to-b before:from-transparent before:via-[#153F2D]/10 before:to-transparent">
                <AnimatePresence mode="popLayout">
                  {activeSurplus.map((item) => {
                    const hoursToExpiry = getHoursUntilExpiry(item.expiresAt)
                    const isUrgent = hoursToExpiry <= 3
                    
                    // Color grading based on urgency
                    const statusColor = isUrgent ? 'border-[#D9534F]/30 bg-[#D9534F]/5' : 'border-[#5DB06D]/30 bg-[#5DB06D]/5'
                    const dotColor = isUrgent ? 'bg-[#D9534F]' : 'bg-[#5DB06D]'

                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.96, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: -20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                      >
                        {/* Timeline Dot */}
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-[3px] border-[#FDFBF7] bg-white shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10 ${statusColor}`}>
                           <div className={`w-2.5 h-2.5 rounded-full ${dotColor} ${isUrgent ? 'animate-pulse' : ''}`} />
                        </div>

                        {/* Card */}
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-[2rem] bg-white border border-[#153F2D]/5 shadow-sm hover:shadow-[0_16px_32px_-12px_rgba(21,63,45,0.08)] transition-all overflow-hidden relative">
                          
                          {/* Food Image Header */}
                          {item.imageUrl && (
                            <div className="relative h-28 w-full rounded-xl overflow-hidden mb-4 -mt-2 -mx-0 shadow-inner">
                              <Image 
                                src={item.imageUrl} 
                                alt={item.name} 
                                fill 
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                              
                              {/* Status overlays on image */}
                              <div className="absolute top-2 right-2">
                                {isUrgent && (
                                  <span className="bg-[#D9534F] text-white text-[9px] px-2 py-0.5 rounded-md uppercase tracking-widest font-extrabold shadow-sm border border-white/20">Urgent</span>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="flex justify-between items-start mb-4">
                             <div>
                               <h4 className="text-[16px] font-extrabold text-[#153F2D] mb-1 tracking-tight">{item.name}</h4>
                               <p className="text-[12px] font-bold text-[#153F2D]/50 uppercase tracking-widest">{item.quantity} {item.unit}</p>
                             </div>
                          </div>
                          
                          <div className="flex items-center gap-5 mt-5 pt-5 border-t border-[#153F2D]/5">
                            <div className="flex items-center gap-2 text-[12px] font-bold text-[#153F2D]/60">
                              <Clock className="w-4 h-4 text-[#153F2D]/40" />
                              <span>{hoursToExpiry}h left</span>
                            </div>
                            <div className="flex items-center gap-2 text-[12px] font-bold text-[#5DB06D]">
                              <Activity className="w-3.5 h-3.5" />
                              <span>Saves {parseInt(item.quantity.toString()) * 2.5}kg CO₂</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>

                {activeSurplus.length === 0 && (
                  <motion.div variants={fadeUp} className="py-24 text-center relative z-10">
                    <div className="w-20 h-20 bg-white/50 rounded-[2rem] flex items-center justify-center mx-auto mb-5 shadow-sm border border-[#153F2D]/5">
                      <Package className="w-8 h-8 text-[#153F2D]/20" />
                    </div>
                    <p className="text-[15px] text-[#153F2D]/60 font-bold">No active surplus.</p>
                    <p className="text-[13px] text-[#153F2D]/40 mt-1 font-medium">Kitchen drops will appear here.</p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </motion.div>
  )
}

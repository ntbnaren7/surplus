"use client"

import { useState } from "react"
import { useDonor } from "@/hooks/useDonor"
import { getHoursUntilExpiry } from "@/utils/time"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { Clock, Plus, Zap, Package, Send } from "lucide-react"

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
  }

  return (
    <motion.div
      className="space-y-10 max-w-[1000px] mx-auto pt-8"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ── Left Column: Inputs ── */}
        <div className="space-y-8">
          
          {/* POS Simulation Card */}
          <motion.div
            variants={fadeUp}
            className="rounded-[2rem] bg-white/70 backdrop-blur-[40px] shadow-glass ring-1 ring-white/40 glass-noise p-8 relative overflow-hidden"
          >
            <div className="flex flex-col gap-6 relative z-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#1A3C34]/5 border border-[#1A3C34]/10 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-[#2D7A3A]" />
                </div>
                <div>
                  <h2 className="text-[18px] font-bold text-[#1A3C34] tracking-[-0.02em] mb-1">POS Integration</h2>
                  <p className="text-[13px] text-[#1A3C34]/60 leading-relaxed max-w-[280px]">
                    Automatic syncing with Square & Toast. Kitchen closing triggers an automatic surplus drop.
                  </p>
                </div>
              </div>
              <Button onClick={simulateDrop} className="bg-[#1A3C34] text-white rounded-full hover:bg-[#152E28] shadow-[0_8px_30px_rgba(26,60,52,0.2)] transition-all">
                <Plus className="w-4 h-4 mr-2" />
                Simulate Kitchen Drop
              </Button>
            </div>
          </motion.div>

          {/* Quick-Drop Manual Form */}
          <motion.div
            variants={fadeUp}
            className="rounded-[2rem] bg-white/70 backdrop-blur-[40px] shadow-glass ring-1 ring-white/40 glass-noise p-8 relative"
          >
            <div className="mb-6">
              <h2 className="text-[18px] font-bold text-[#1A3C34] tracking-[-0.02em] mb-1">Quick-Drop Manual Entry</h2>
              <p className="text-[13px] text-[#1A3C34]/60">For un-tracked food like buffets and catering.</p>
            </div>

            <form onSubmit={handleManualDrop} className="space-y-5">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A3C34]/50 mb-2 block">Item / Category</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/50 border border-[#1A3C34]/10 rounded-xl px-4 py-3 text-[14px] text-[#1A3C34] focus:outline-none focus:ring-2 focus:ring-[#2D7A3A]/30 transition-all shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A3C34]/50 mb-2 block">Amount</label>
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-white/50 border border-[#1A3C34]/10 rounded-xl px-4 py-3 text-[14px] text-[#1A3C34] focus:outline-none focus:ring-2 focus:ring-[#2D7A3A]/30 transition-all shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A3C34]/50 mb-2 block">Unit</label>
                  <select 
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as any)}
                    className="w-full bg-white/50 border border-[#1A3C34]/10 rounded-xl px-4 py-3 text-[14px] text-[#1A3C34] focus:outline-none focus:ring-2 focus:ring-[#2D7A3A]/30 transition-all shadow-sm appearance-none"
                  >
                    <option value="kg">Trays / Kg</option>
                    <option value="portions">Portions</option>
                    <option value="pieces">Pieces</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#1A3C34]/50 mb-2 block">Shelf Life (Expiry)</label>
                <div className="flex gap-2">
                  {[
                    { label: '⚡️ 1 Hour', value: 1 },
                    { label: '⏰ 3 Hours', value: 3 },
                    { label: '🌙 End of Day', value: 12 }
                  ].map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setExpiryHours(preset.value)}
                      className={`flex-1 py-2.5 rounded-xl text-[12px] font-semibold transition-all border ${
                        expiryHours === preset.value 
                          ? 'bg-[#1A3C34] text-white border-[#1A3C34] shadow-[0_4px_12px_rgba(26,60,52,0.3)]' 
                          : 'bg-white/50 text-[#1A3C34]/60 border-[#1A3C34]/10 hover:bg-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full bg-[#2D7A3A] text-white rounded-xl py-6 hover:bg-[#225e2c] shadow-[0_8px_30px_rgba(45,122,58,0.3)] transition-all text-[14px] font-bold tracking-wide uppercase mt-4">
                <Send className="w-4 h-4 mr-2" />
                Broadcast to Network
              </Button>
            </form>
          </motion.div>
        </div>

        {/* ── Right Column: Active Feed ── */}
        <div className="space-y-6">
          <motion.div variants={fadeUp} className="flex items-center justify-between">
            <div>
              <h2 className="text-[20px] font-bold tracking-[-0.02em] text-[#1A3C34]">Active Surplus</h2>
              <p className="text-[13px] text-[#1A3C34]/60 mt-0.5">Awaiting matching and dispatch.</p>
            </div>
            <Badge variant="outline" className="border-[#1A3C34]/20 text-[#1A3C34] bg-white/50">{activeSurplus.length} items</Badge>
          </motion.div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {activeSurplus.map((item) => {
                const hoursToExpiry = getHoursUntilExpiry(item.expiresAt)
                const isUrgent = hoursToExpiry <= 3

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.96, x: -20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <div className={`rounded-2xl bg-white/80 backdrop-blur-xl shadow-sm ring-1 p-5 transition-all duration-300 hover:shadow-md ${isUrgent ? 'ring-red-500/30 bg-red-50/50' : 'ring-[#1A3C34]/10'}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isUrgent ? 'bg-red-500/10' : 'bg-[#1A3C34]/5'}`}>
                            <Package className={`w-4 h-4 ${isUrgent ? 'text-red-500' : 'text-[#1A3C34]/50'}`} />
                          </div>
                          <div>
                            <p className="text-[15px] font-bold text-[#1A3C34]">{item.name}</p>
                            <p className="text-[12px] font-mono text-[#1A3C34]/60 uppercase tracking-widest">{item.quantity} {item.unit}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[12px] font-mono text-[#1A3C34]/60">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{hoursToExpiry}h remaining</span>
                        </div>
                        {isUrgent && (
                          <Badge variant="destructive" className="animate-breathe bg-red-500 hover:bg-red-600 text-[10px] px-2 py-0 uppercase tracking-wider">Urgent</Badge>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
            {activeSurplus.length === 0 && (
              <motion.div variants={fadeUp} className="py-16 text-center rounded-[2rem] border border-dashed border-[#1A3C34]/20 bg-white/30 backdrop-blur-md">
                <Package className="w-8 h-8 text-[#1A3C34]/20 mx-auto mb-3" />
                <p className="text-[13px] text-[#1A3C34]/50 font-medium">No active surplus. Kitchen is open.</p>
              </motion.div>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  )
}

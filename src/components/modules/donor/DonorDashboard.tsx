"use client"

import { useState, useMemo } from "react"
import { useDonor } from "@/hooks/useDonor"
import { useSurplusPredictor } from "@/hooks/useSurplusPredictor"
import { useSurplusStore } from "@/store/useSurplusStore"
import { getHoursUntilExpiry } from "@/utils/time"
import { Button } from "@/components/ui/button"
import { VisionScannerModal } from "@/components/ui/VisionScannerModal"
import { GSAReceiptModal } from "@/components/ui/GSAReceiptModal"
import { DonorEmptyState } from "@/components/ui/EmptyStates"
import { type VisionScanResult } from "@/lib/vision"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, Plus, Zap, Package, Activity, Leaf, TrendingUp, CheckCircle2, DollarSign, Radio, Brain, Sparkles, BarChart3, Camera, FileText } from "lucide-react"

/* ─── Bento card wrapper (shared pattern) ─── */
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

/* ─── Simulated POS items waiting to be broadcast ─── */
const POS_QUEUE = [
  { id: 'pos-1', name: 'Assorted Pastries', qty: 14, unit: 'pieces', source: 'Square POS', age: '2h ago' },
  { id: 'pos-2', name: 'Grilled Chicken Wraps', qty: 8, unit: 'portions', source: 'Toast POS', age: '45m ago' },
  { id: 'pos-3', name: 'Mixed Salad Bowls', qty: 6, unit: 'kg', source: 'Square POS', age: '20m ago' },
]

export function DonorDashboardModule() {
  const { activeSurplus, simulateDrop, submitManualDrop } = useDonor()
  const { inventory } = useSurplusStore()
  const { predictions, avgConfidence, modelVersion } = useSurplusPredictor()

  // Form state
  const [name, setName] = useState("Mixed Buffet Leftovers")
  const [quantity, setQuantity] = useState("2")
  const [unit, setUnit] = useState<'portions' | 'pieces' | 'kg'>('kg')
  const [expiryHours, setExpiryHours] = useState<number>(3)

  const handleManualDrop = (e: React.FormEvent) => {
    e.preventDefault()
    submitManualDrop(name, parseInt(quantity) || 1, unit, expiryHours)
  }

  /* ─── Vision Scanner State ─── */
  const [scannerOpen, setScannerOpen] = useState(false)
  /* ─── GSA Receipt State ─── */
  const [receiptOpen, setReceiptOpen] = useState(false)

  const handleScanComplete = (result: VisionScanResult) => {
    setName(result.itemName)
    setQuantity(result.estimatedQuantity.toString())
    setUnit(result.estimatedUnit)
    setScannerOpen(false)
  }

  /* ─── Computed stats ─── */
  const stats = useMemo(() => {
    const delivered = inventory.filter(i => i.status === 'DELIVERED').length
    const claimed = inventory.filter(i => i.status === 'CLAIMED' || i.status === 'IN_TRANSIT').length
    const totalBroadcast = activeSurplus.length
    const co2Diverted = delivered * 2.4
    const taxCredit = delivered * 18.50 // ~$18.50 per batch under Good Samaritan Act
    return { delivered, claimed, totalBroadcast, co2Diverted, taxCredit }
  }, [inventory, activeSurplus])

  return (
    <div className="w-full max-w-[1400px] mx-auto">

      {/* ─── BENTO GRID ─── */}
      <div className="grid grid-cols-12 gap-4 auto-rows-auto">

        {/* ══════════════════════════════════════════════
            TILE 1: POS AUTOMATION HUB  (7 cols, 2 rows)
        ══════════════════════════════════════════════ */}
        <BentoCard className="col-span-12 lg:col-span-7 row-span-2 flex flex-col" delay={0}>
          <div className="p-6 pb-4 border-b border-[#153F2D]/5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[22px] font-extrabold text-[#153F2D] tracking-tight">POS Auto-Sync</h2>
                <p className="text-[12px] text-[#153F2D]/50 font-medium mt-0.5">Flagged waste from Square & Toast</p>
              </div>
              <button
                onClick={simulateDrop}
                className="flex items-center gap-2.5 bg-[#5DB06D]/10 rounded-full px-4 py-2 border border-[#5DB06D]/20 hover:bg-[#5DB06D]/20 transition-all group cursor-pointer"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5DB06D] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5DB06D]" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#5DB06D]">Sync Now</span>
                <Plus className="w-3.5 h-3.5 text-[#5DB06D] group-hover:rotate-90 transition-transform" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
            {/* Simulated POS Queue Items */}
            {POS_QUEUE.map((posItem, idx) => (
              <motion.div
                key={posItem.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="rounded-2xl border border-[#153F2D]/5 bg-white p-5 hover:-translate-y-0.5 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#EAB308]/10 flex items-center justify-center border border-[#EAB308]/20">
                      <Radio className="w-4.5 h-4.5 text-[#EAB308]" />
                    </div>
                    <div>
                      <p className="font-extrabold text-[#153F2D] text-[15px] leading-tight">{posItem.name}</p>
                      <div className="flex items-center gap-2 text-[11px] text-[#153F2D]/50 font-bold mt-1">
                        <span className="uppercase tracking-wider">{posItem.qty} {posItem.unit}</span>
                        <span className="text-[#153F2D]/20">•</span>
                        <span>{posItem.source}</span>
                        <span className="text-[#153F2D]/20">•</span>
                        <span className="text-[#EAB308]">{posItem.age}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={simulateDrop}
                    size="sm"
                    className="bg-[#5DB06D] hover:bg-[#4a9a5c] text-white font-extrabold tracking-widest uppercase text-[10px] px-5 py-4 rounded-xl shadow-sm group-hover:shadow-[0_8px_16px_rgba(93,176,109,0.3)] transition-all"
                  >
                    <Activity className="w-3.5 h-3.5 mr-1.5" />
                    Broadcast
                  </Button>
                </div>
              </motion.div>
            ))}

            {/* Live surplus feed below POS queue */}
            {activeSurplus.length > 0 && (
              <div className="pt-4 border-t border-[#153F2D]/5 mt-4">
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#153F2D]/30 mb-3 px-1">Live on Network</p>
                <AnimatePresence mode="popLayout">
                  {activeSurplus.map((item) => {
                    const hoursToExpiry = getHoursUntilExpiry(item.expiresAt)
                    const isUrgent = hoursToExpiry <= 3

                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ type: "spring", stiffness: 300, damping: 28 }}
                        className={`rounded-2xl border p-4 mb-3 transition-all ${isUrgent ? 'bg-[#D9534F]/5 border-[#D9534F]/15' : 'bg-[#153F2D]/[0.02] border-[#153F2D]/5'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${isUrgent ? 'bg-[#D9534F] animate-pulse' : 'bg-[#5DB06D]'}`} />
                            <div>
                              <p className="font-extrabold text-[#153F2D] text-[14px]">{item.name}</p>
                              <div className="flex items-center gap-2 text-[11px] text-[#153F2D]/50 font-bold mt-0.5">
                                <Clock className="w-3 h-3" />
                                <span>{hoursToExpiry}h left</span>
                                <span className="text-[#153F2D]/20">•</span>
                                <span className="uppercase tracking-wider">{item.quantity} {item.unit}</span>
                              </div>
                            </div>
                          </div>
                          <span className={`text-[9px] px-2.5 py-1 rounded-md uppercase tracking-widest font-extrabold ${isUrgent ? 'bg-[#D9534F]/10 text-[#D9534F]' : 'bg-[#5DB06D]/10 text-[#5DB06D]'}`}>
                            {isUrgent ? 'Expiring Soon' : 'Broadcasting'}
                          </span>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            )}

            {activeSurplus.length === 0 && (
              <div className="pt-4 border-t border-[#153F2D]/5 mt-4">
                <DonorEmptyState />
              </div>
            )}
          </div>
        </BentoCard>

        {/* ══════════════════════════════════════════════
            TILE 2: MANUAL BROADCAST  (5 cols, 2 rows)
        ══════════════════════════════════════════════ */}
        <BentoCard className="col-span-12 lg:col-span-5 row-span-2 flex flex-col" delay={0.08}>
          <div className="p-6 pb-4 border-b border-[#153F2D]/5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[22px] font-extrabold text-[#153F2D] tracking-tight">Quick Drop</h2>
                <p className="text-[12px] text-[#153F2D]/50 font-medium mt-0.5">Manual or AI-powered entry</p>
              </div>
              <button
                onClick={() => setScannerOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] rounded-xl px-3.5 py-2.5 shadow-[0_6px_12px_rgba(124,58,237,0.3)] hover:shadow-[0_8px_16px_rgba(124,58,237,0.4)] hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4 text-white" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-white">AI Scan</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleManualDrop} className="flex-1 flex flex-col p-6 space-y-7">
            {/* Item Name */}
            <div className="relative">
              <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#153F2D]/40 mb-2 block">Item Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What are you donating?"
                className="w-full bg-transparent border-b-2 border-[#153F2D]/10 pb-3 text-[20px] font-bold text-[#153F2D] placeholder:text-[#153F2D]/20 focus:outline-none focus:border-[#5DB06D] transition-colors"
              />
            </div>

            {/* Quantity & Unit */}
            <div className="flex items-end gap-5">
              <div className="flex-1">
                <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#153F2D]/40 mb-2 block">Amount</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-[#153F2D]/10 pb-2 text-[18px] font-bold text-[#153F2D] focus:outline-none focus:border-[#5DB06D] transition-colors"
                />
              </div>
              <div className="flex-1">
                <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#153F2D]/40 mb-2 block">Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as 'portions' | 'pieces' | 'kg')}
                  className="w-full bg-transparent border-b-2 border-[#153F2D]/10 pb-2 text-[18px] font-bold text-[#153F2D] focus:outline-none focus:border-[#5DB06D] transition-colors appearance-none cursor-pointer"
                >
                  <option value="kg">Trays / Kg</option>
                  <option value="portions">Portions</option>
                  <option value="pieces">Pieces</option>
                </select>
              </div>
            </div>

            {/* Shelf Life */}
            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#153F2D]/40 mb-3 block">Shelf Life</label>
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

            {/* Broadcast Button */}
            <div className="mt-auto pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full relative group overflow-hidden bg-[#5DB06D] text-white rounded-2xl py-5 shadow-[0_16px_32px_-8px_rgba(93,176,109,0.4)] transition-all flex items-center justify-center gap-3"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
                <span className="text-[14px] font-extrabold tracking-widest uppercase">Broadcast</span>
                <Activity className="w-5 h-5" />
              </motion.button>
            </div>
          </form>
        </BentoCard>

        {/* ══════════════════════════════════════════════
            TILE AI: SURPLUS PREDICTOR  (12 cols)
        ══════════════════════════════════════════════ */}
        <BentoCard className="col-span-12 flex flex-col" delay={0.12}>
          <div className="p-6 pb-4 border-b border-[#153F2D]/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] flex items-center justify-center shadow-[0_8px_16px_rgba(124,58,237,0.3)]">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-[20px] font-extrabold text-[#153F2D] tracking-tight">AI Surplus Forecast</h2>
                  <p className="text-[11px] text-[#153F2D]/50 font-medium mt-0.5">Predictive demand engine • Model v{modelVersion}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 bg-[#7C3AED]/10 rounded-full px-3 py-1.5 border border-[#7C3AED]/20">
                <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#7C3AED]">{Math.round(avgConfidence * 100)}% Avg Confidence</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            {predictions.map((pred, idx) => (
              <motion.div
                key={pred.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + idx * 0.08 }}
                className="rounded-2xl border border-[#7C3AED]/10 bg-gradient-to-br from-[#7C3AED]/[0.03] to-transparent p-5 hover:-translate-y-0.5 transition-all group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-extrabold text-[#153F2D] text-[16px] leading-tight">{pred.itemName}</p>
                    <div className="flex items-center gap-2 text-[11px] text-[#153F2D]/50 font-bold mt-1">
                      <Clock className="w-3 h-3" />
                      <span>Est. {pred.predictedTime}</span>
                      <span className="text-[#153F2D]/20">•</span>
                      <span className="uppercase tracking-wider">{pred.predictedQuantity} {pred.predictedUnit}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-md uppercase tracking-widest font-extrabold ${
                    pred.confidence >= 0.85 ? 'bg-[#5DB06D]/10 text-[#5DB06D]' :
                    pred.confidence >= 0.65 ? 'bg-[#EAB308]/10 text-[#EAB308]' :
                    'bg-[#153F2D]/5 text-[#153F2D]/50'
                  }`}>
                    {Math.round(pred.confidence * 100)}%
                  </span>
                </div>

                {/* Confidence Bar */}
                <div className="mb-3">
                  <div className="h-1.5 w-full bg-[#153F2D]/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#5DB06D]"
                      initial={{ width: 0 }}
                      animate={{ width: `${pred.confidence * 100}%` }}
                      transition={{ duration: 1.2, delay: 0.3 + idx * 0.1 }}
                    />
                  </div>
                </div>

                {/* Feature Weights Mini-Chart */}
                <div className="flex items-end gap-1 h-8 mb-3">
                  {[
                    { label: 'Hist', value: pred.featureWeights.historical },
                    { label: 'Day', value: pred.featureWeights.dayOfWeek },
                    { label: 'Time', value: pred.featureWeights.timeOfDay },
                    { label: 'Wthr', value: pred.featureWeights.weather },
                    { label: 'Evt', value: pred.featureWeights.events },
                  ].map((f, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                      <motion.div
                        className="w-full rounded-sm bg-[#7C3AED]/20"
                        initial={{ height: 0 }}
                        animate={{ height: `${f.value * 28}px` }}
                        transition={{ duration: 0.8, delay: 0.5 + i * 0.05 }}
                      />
                      <span className="text-[8px] font-bold text-[#153F2D]/30 uppercase">{f.label}</span>
                    </div>
                  ))}
                </div>

                {/* Reasoning */}
                <p className="text-[11px] text-[#153F2D]/50 font-medium leading-relaxed mb-4">{pred.reasoning}</p>

                {/* Action */}
                <Button
                  onClick={simulateDrop}
                  size="sm"
                  className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold tracking-widest uppercase text-[10px] py-3.5 rounded-xl shadow-sm group-hover:shadow-[0_8px_16px_rgba(124,58,237,0.3)] transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  Pre-Validate Drop
                </Button>
              </motion.div>
            ))}
          </div>
        </BentoCard>

        {/* ══════════════════════════════════════════════
            TILE 3: DELIVERIES COMPLETED  (4 cols)
        ══════════════════════════════════════════════ */}
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
          <p className="text-[12px] font-bold text-[#153F2D]/40 uppercase tracking-widest mt-2">Batches Recovered</p>
        </BentoCard>

        {/* ══════════════════════════════════════════════
            TILE 4: CO₂ IMPACT  (4 cols)
        ══════════════════════════════════════════════ */}
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
          <p className="text-[36px] font-extrabold text-[#153F2D] tracking-tight leading-none">{stats.co2Diverted.toFixed(1)}<span className="text-[18px] text-[#153F2D]/40 ml-1">kg</span></p>
          <p className="text-[12px] font-bold text-[#153F2D]/40 uppercase tracking-widest mt-2">CO₂ Diverted</p>
        </BentoCard>

        {/* ══════════════════════════════════════════════
            TILE 5: TAX CREDIT ESTIMATE  (4 cols)
        ══════════════════════════════════════════════ */}
        <BentoCard className="col-span-12 sm:col-span-4 p-6" delay={0.24}>
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-2xl bg-[#153F2D]/5 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[#153F2D]/60" />
            </div>
            <div className="flex items-center gap-1.5 text-[#153F2D]/60 text-[11px] font-bold bg-[#153F2D]/5 px-2.5 py-1 rounded-lg">
              <TrendingUp className="w-3 h-3" />
              Est.
            </div>
          </div>
          <p className="text-[36px] font-extrabold text-[#153F2D] tracking-tight leading-none">${stats.taxCredit.toFixed(0)}</p>
          <p className="text-[12px] font-bold text-[#153F2D]/40 uppercase tracking-widest mt-2">Tax Credit (GSA)</p>
          {stats.delivered > 0 && (
            <button
              onClick={() => setReceiptOpen(true)}
              className="mt-3 flex items-center gap-1.5 text-[10px] font-extrabold text-[#5DB06D] uppercase tracking-widest hover:text-[#153F2D] transition-colors"
            >
              <FileText className="w-3 h-3" />
              View Receipt
            </button>
          )}
        </BentoCard>
      </div>

      {/* ─── Vision Scanner Modal ─── */}
      <VisionScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScanComplete={handleScanComplete}
      />

      {/* ─── GSA Receipt Modal ─── */}
      <GSAReceiptModal
        isOpen={receiptOpen}
        onClose={() => setReceiptOpen(false)}
        items={inventory}
      />
    </div>
  )
}

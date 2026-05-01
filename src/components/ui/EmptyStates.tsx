"use client"

import { motion } from 'framer-motion'
import { Package, Radar, Truck } from 'lucide-react'

interface EmptyStateProps {
  className?: string
}

export function DonorEmptyState({ className = '' }: EmptyStateProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col items-center justify-center py-16 px-8 ${className}`}>
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }} className="relative mb-8">
        <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-[#5DB06D]/15 to-[#153F2D]/10 flex items-center justify-center border border-[#5DB06D]/20">
          <Package className="w-10 h-10 text-[#5DB06D]/60" />
        </div>
        <div className="absolute inset-0 rounded-[2rem] bg-[#5DB06D]/5 blur-xl -z-10 scale-150" />
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#5DB06D] shadow-[0_0_12px_rgba(93,176,109,0.6)]" />
      </motion.div>
      <h3 className="text-[18px] font-extrabold text-[#153F2D] tracking-tight text-center mb-2">Kitchen Running Lean</h3>
      <p className="text-[13px] text-[#153F2D]/40 font-medium text-center max-w-[320px] leading-relaxed">
        No surplus detected. Tap <span className="font-bold text-[#5DB06D]">&quot;Broadcast Surplus&quot;</span> to publish excess inventory.
      </p>
    </motion.div>
  )
}

export function DriverEmptyState({ className = '' }: EmptyStateProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col items-center justify-center py-16 px-8 ${className}`}>
      <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="relative mb-8">
        <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-[#EAB308]/15 to-[#EAB308]/5 flex items-center justify-center border border-[#EAB308]/20">
          <Truck className="w-10 h-10 text-[#EAB308]/60" />
        </div>
        <div className="absolute inset-0 rounded-[2rem] bg-[#EAB308]/5 blur-xl -z-10 scale-150" />
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute inset-0 rounded-[2rem] border-2 border-[#EAB308]/30" />
      </motion.div>
      <h3 className="text-[18px] font-extrabold text-[#153F2D] tracking-tight text-center mb-2">Standing By</h3>
      <p className="text-[13px] text-[#153F2D]/40 font-medium text-center max-w-[320px] leading-relaxed">
        No active missions. You&apos;ll be automatically dispatched when a facility claims surplus near your route.
      </p>
    </motion.div>
  )
}

export function ReceiverEmptyState({ className = '' }: EmptyStateProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col items-center justify-center py-16 px-8 ${className}`}>
      <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }} className="relative mb-8">
        <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-[#7C3AED]/15 to-[#7C3AED]/5 flex items-center justify-center border border-[#7C3AED]/20">
          <Radar className="w-10 h-10 text-[#7C3AED]/60" />
        </div>
        <div className="absolute inset-0 rounded-[2rem] bg-[#7C3AED]/5 blur-xl -z-10 scale-150" />
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 rounded-[2rem] overflow-hidden">
          <div className="absolute top-1/2 left-1/2 w-1/2 h-[2px] bg-gradient-to-r from-[#7C3AED]/40 to-transparent origin-left -translate-y-1/2" />
        </motion.div>
      </motion.div>
      <h3 className="text-[18px] font-extrabold text-[#153F2D] tracking-tight text-center mb-2">Scanning Local Radius</h3>
      <p className="text-[13px] text-[#153F2D]/40 font-medium text-center max-w-[320px] leading-relaxed">
        No surplus matches in your area. The AI matcher is actively scanning. You&apos;ll be notified instantly when food becomes available.
      </p>
    </motion.div>
  )
}

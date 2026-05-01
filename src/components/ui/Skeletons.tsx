"use client"

import { motion } from 'framer-motion'

/* Shimmer animation keyframe */
const shimmerVariant = {
  animate: {
    backgroundPosition: ['200% 0%', '-200% 0%'],
    transition: { duration: 2.5, repeat: Infinity, ease: 'linear' as const },
  },
}

function ShimmerBlock({ className = '' }: { className?: string }) {
  return (
    <motion.div
      variants={shimmerVariant}
      animate="animate"
      className={`rounded-xl bg-gradient-to-r from-[#153F2D]/[0.04] via-[#153F2D]/[0.08] to-[#153F2D]/[0.04] bg-[length:200%_100%] ${className}`}
    />
  )
}

export function DonorDashboardSkeleton() {
  return (
    <div className="w-full max-w-[1400px] mx-auto">
      <div className="grid grid-cols-12 gap-4">
        {/* POS Tile */}
        <div className="col-span-12 lg:col-span-7 row-span-2 rounded-[2rem] bg-white/80 border border-[#153F2D]/[0.06] p-6">
          <ShimmerBlock className="h-5 w-40 mb-4" />
          <ShimmerBlock className="h-3 w-64 mb-6" />
          <div className="space-y-3">
            <ShimmerBlock className="h-16 w-full" />
            <ShimmerBlock className="h-16 w-full" />
            <ShimmerBlock className="h-16 w-full" />
          </div>
        </div>
        {/* Stats Tiles */}
        <div className="col-span-12 lg:col-span-5 row-span-1 rounded-[2rem] bg-white/80 border border-[#153F2D]/[0.06] p-6">
          <ShimmerBlock className="h-4 w-32 mb-4" />
          <div className="grid grid-cols-2 gap-3">
            <ShimmerBlock className="h-20" />
            <ShimmerBlock className="h-20" />
            <ShimmerBlock className="h-20" />
            <ShimmerBlock className="h-20" />
          </div>
        </div>
        {/* AI Forecast */}
        <div className="col-span-12 lg:col-span-5 row-span-1 rounded-[2rem] bg-white/80 border border-[#153F2D]/[0.06] p-6">
          <ShimmerBlock className="h-4 w-28 mb-4" />
          <ShimmerBlock className="h-24 w-full mb-3" />
          <ShimmerBlock className="h-3 w-48" />
        </div>
      </div>
    </div>
  )
}

export function DriverDashboardSkeleton() {
  return (
    <div className="w-full max-w-[1400px] mx-auto">
      <div className="grid grid-cols-12 gap-4">
        {/* Map Tile */}
        <div className="col-span-12 lg:col-span-8 row-span-2 rounded-[2rem] bg-white/80 border border-[#153F2D]/[0.06] overflow-hidden">
          <ShimmerBlock className="h-[620px] w-full rounded-none" />
        </div>
        {/* Active Missions */}
        <div className="col-span-12 lg:col-span-4 row-span-2 rounded-[2rem] bg-white/80 border border-[#153F2D]/[0.06] p-6">
          <ShimmerBlock className="h-5 w-32 mb-6" />
          <div className="space-y-3">
            <ShimmerBlock className="h-24 w-full" />
            <ShimmerBlock className="h-24 w-full" />
            <ShimmerBlock className="h-24 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function ReceiverDashboardSkeleton() {
  return (
    <div className="w-full max-w-[1400px] mx-auto">
      <div className="grid grid-cols-12 gap-4">
        {/* Map */}
        <div className="col-span-12 lg:col-span-5 row-span-2 rounded-[2rem] bg-white/80 border border-[#153F2D]/[0.06] overflow-hidden">
          <ShimmerBlock className="h-[620px] w-full rounded-none" />
        </div>
        {/* Feed */}
        <div className="col-span-12 lg:col-span-7 row-span-2 rounded-[2rem] bg-white/80 border border-[#153F2D]/[0.06] p-6">
          <ShimmerBlock className="h-5 w-28 mb-6" />
          <div className="space-y-3">
            <ShimmerBlock className="h-32 w-full" />
            <ShimmerBlock className="h-32 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

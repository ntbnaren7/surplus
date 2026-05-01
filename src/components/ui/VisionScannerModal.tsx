"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, X, Scan, CheckCircle2, ShieldCheck, Zap, Apple } from "lucide-react"
import { scanFoodItem, type VisionScanResult } from "@/lib/vision"

interface VisionScannerModalProps {
  isOpen: boolean
  onClose: () => void
  onScanComplete: (result: VisionScanResult) => void
}

type ScanPhase = 'idle' | 'scanning' | 'complete'

export function VisionScannerModal({ isOpen, onClose, onScanComplete }: VisionScannerModalProps) {
  const [phase, setPhase] = useState<ScanPhase>('idle')
  const [currentStep, setCurrentStep] = useState('')
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<VisionScanResult | null>(null)

  const startScan = useCallback(async () => {
    setPhase('scanning')
    setProgress(0)
    setCurrentStep('Initializing neural network...')

    const scanResult = await scanFoodItem((step, prog) => {
      setCurrentStep(step)
      setProgress(prog)
    })

    setResult(scanResult)
    setPhase('complete')
  }, [])

  const handleAccept = () => {
    if (result) {
      onScanComplete(result)
    }
    // Reset state for next scan
    setPhase('idle')
    setCurrentStep('')
    setProgress(0)
    setResult(null)
  }

  const handleClose = () => {
    setPhase('idle')
    setCurrentStep('')
    setProgress(0)
    setResult(null)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-[#0a0a0a] rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] border border-white/5 w-full max-w-[520px] overflow-hidden">

              {/* Header */}
              <div className="p-5 pb-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#EC4899] flex items-center justify-center shadow-[0_8px_16px_rgba(124,58,237,0.4)]">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-extrabold text-white">Vision Scanner</h3>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">AI Food Audit • v2.1</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4 text-white/50" />
                </button>
              </div>

              {/* ═══ IDLE PHASE ═══ */}
              {phase === 'idle' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 text-center"
                >
                  {/* Simulated viewfinder */}
                  <div className="relative w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#111] to-[#1a1a1a] border border-white/5 overflow-hidden mb-6">
                    {/* Scan reticle */}
                    <div className="absolute inset-8 border-2 border-dashed border-[#7C3AED]/30 rounded-xl" />
                    <div className="absolute top-6 left-6 w-6 h-6 border-t-2 border-l-2 border-[#7C3AED] rounded-tl-lg" />
                    <div className="absolute top-6 right-6 w-6 h-6 border-t-2 border-r-2 border-[#7C3AED] rounded-tr-lg" />
                    <div className="absolute bottom-6 left-6 w-6 h-6 border-b-2 border-l-2 border-[#7C3AED] rounded-bl-lg" />
                    <div className="absolute bottom-6 right-6 w-6 h-6 border-b-2 border-r-2 border-[#7C3AED] rounded-br-lg" />
                    {/* Center icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-[#7C3AED]/10 flex items-center justify-center border border-[#7C3AED]/20">
                        <Scan className="w-7 h-7 text-[#7C3AED]/60" />
                      </div>
                    </div>
                  </div>

                  <p className="text-[13px] text-white/50 font-medium mb-6">
                    Point your camera at the surplus food, or tap below to simulate a scan.
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={startScan}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white font-extrabold tracking-widest uppercase text-[12px] shadow-[0_12px_24px_rgba(124,58,237,0.4)] flex items-center justify-center gap-2"
                  >
                    <Scan className="w-4 h-4" />
                    Start AI Scan
                  </motion.button>
                </motion.div>
              )}

              {/* ═══ SCANNING PHASE ═══ */}
              {phase === 'scanning' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8"
                >
                  {/* Simulated viewfinder with scanning laser */}
                  <div className="relative w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#111] to-[#1a1a1a] border border-[#7C3AED]/20 overflow-hidden mb-6">
                    {/* Scanning laser line */}
                    <motion.div
                      className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#7C3AED] to-transparent shadow-[0_0_20px_rgba(124,58,237,0.8)]"
                      animate={{ top: ['10%', '90%', '10%'] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    {/* Corner brackets */}
                    <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-[#7C3AED] rounded-tl-md" />
                    <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-[#7C3AED] rounded-tr-md" />
                    <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-[#7C3AED] rounded-bl-md" />
                    <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-[#7C3AED] rounded-br-md" />
                    {/* Center pulse */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        className="w-12 h-12 rounded-full border-2 border-[#7C3AED]/40"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    </div>
                    {/* Processing tags */}
                    <motion.div
                      className="absolute top-6 left-6 bg-[#7C3AED]/20 backdrop-blur-sm rounded-md px-2 py-1 border border-[#7C3AED]/30"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    >
                      <span className="text-[9px] font-bold text-[#7C3AED] uppercase tracking-widest">Classifying</span>
                    </motion.div>
                    <motion.div
                      className="absolute bottom-6 right-6 bg-[#EC4899]/20 backdrop-blur-sm rounded-md px-2 py-1 border border-[#EC4899]/30"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                    >
                      <span className="text-[9px] font-bold text-[#EC4899] uppercase tracking-widest">Quality Audit</span>
                    </motion.div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[12px] font-bold text-white/70">{currentStep}</p>
                      <span className="text-[11px] font-extrabold text-[#7C3AED]">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899]"
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ═══ COMPLETE PHASE ═══ */}
              {phase === 'complete' && result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6"
                >
                  {/* Success header */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-[#5DB06D]/20 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-[#5DB06D]" />
                    </div>
                    <div>
                      <p className="text-[16px] font-extrabold text-white">Scan Complete</p>
                      <p className="text-[11px] text-white/40 font-bold">{Math.round(result.confidence * 100)}% confidence</p>
                    </div>
                  </div>

                  {/* Result Card */}
                  <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-5 mb-4 space-y-4">
                    {/* Item Info */}
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[18px] font-extrabold text-white">{result.itemName}</p>
                        <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest mt-1">{result.category}</p>
                      </div>
                      <span className="text-[10px] px-2.5 py-1 rounded-md bg-[#7C3AED]/20 text-[#7C3AED] font-extrabold uppercase tracking-widest">
                        {result.estimatedQuantity} {result.estimatedUnit}
                      </span>
                    </div>

                    {/* Metrics Row */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 text-center">
                        <ShieldCheck className="w-4 h-4 text-[#5DB06D] mx-auto mb-1.5" />
                        <p className="text-[20px] font-extrabold text-white leading-none">{result.freshnessScore}%</p>
                        <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest mt-1">Freshness</p>
                      </div>
                      <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 text-center">
                        <Zap className="w-4 h-4 text-[#EAB308] mx-auto mb-1.5" />
                        <p className="text-[20px] font-extrabold text-white leading-none">{result.nutritionEstimate.calories}</p>
                        <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest mt-1">Calories</p>
                      </div>
                      <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 text-center">
                        <Apple className="w-4 h-4 text-[#EC4899] mx-auto mb-1.5" />
                        <p className="text-[20px] font-extrabold text-white leading-none">{result.nutritionEstimate.servings}</p>
                        <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest mt-1">Servings</p>
                      </div>
                    </div>

                    {/* Quality Flags */}
                    <div className="flex flex-wrap gap-2">
                      {result.qualityFlags.map((flag, i) => (
                        <span
                          key={i}
                          className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md bg-[#5DB06D]/10 text-[#5DB06D] border border-[#5DB06D]/20"
                        >
                          {flag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setPhase('idle'); setResult(null) }}
                      className="flex-1 py-3.5 rounded-xl border border-white/10 text-white/50 font-bold text-[11px] uppercase tracking-widest hover:bg-white/5 transition-colors"
                    >
                      Re-Scan
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAccept}
                      className="flex-[2] py-3.5 rounded-xl bg-gradient-to-r from-[#5DB06D] to-[#3d8a4d] text-white font-extrabold text-[11px] uppercase tracking-widest shadow-[0_8px_16px_rgba(93,176,109,0.3)] flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Accept & Auto-Fill
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, X, CheckCircle2, FileText } from "lucide-react"

interface ComplianceModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (signatureData: string) => void
  itemName: string
  itemQuantity: number
  itemUnit: string
  actionType: 'pickup' | 'delivery'
}

export function ComplianceModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemQuantity,
  itemUnit,
  actionType
}: ComplianceModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSigned, setHasSigned] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  /* ─── Drawing logic ─── */
  const startDraw = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    setIsDrawing(true)
    const rect = canvas.getBoundingClientRect()
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top
    ctx.beginPath()
    ctx.moveTo(x, y)
  }, [])

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top
    ctx.strokeStyle = '#153F2D'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineTo(x, y)
    ctx.stroke()
    setHasSigned(true)
  }, [isDrawing])

  const endDraw = useCallback(() => {
    setIsDrawing(false)
  }, [])

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSigned(false)
  }

  const handleConfirm = () => {
    const canvas = canvasRef.current
    const signatureData = canvas ? canvas.toDataURL('image/png') : ''
    setConfirmed(true)
    // Brief success state then close
    setTimeout(() => {
      onConfirm(signatureData)
      setConfirmed(false)
      setHasSigned(false)
      clearSignature()
    }, 1200)
  }

  const timestamp = new Date().toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(21,63,45,0.2)] border border-[#153F2D]/5 w-full max-w-[480px] overflow-hidden">

              {/* Success State */}
              {confirmed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-12 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-[#5DB06D]/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-[#5DB06D]" />
                  </div>
                  <h3 className="text-[24px] font-extrabold text-[#153F2D] mb-2">Verified & Logged</h3>
                  <p className="text-[14px] text-[#153F2D]/50 font-medium">Compliance record saved securely.</p>
                </motion.div>
              ) : (
                <>
                  {/* Header */}
                  <div className="p-6 pb-4 border-b border-[#153F2D]/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#153F2D] flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-[18px] font-extrabold text-[#153F2D]">Compliance Verification</h3>
                        <p className="text-[11px] text-[#153F2D]/50 font-bold uppercase tracking-widest">
                          {actionType === 'pickup' ? 'Pickup Confirmation' : 'Delivery Confirmation'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="w-8 h-8 rounded-lg bg-[#153F2D]/5 flex items-center justify-center hover:bg-[#153F2D]/10 transition-colors"
                    >
                      <X className="w-4 h-4 text-[#153F2D]/60" />
                    </button>
                  </div>

                  {/* Transfer Details */}
                  <div className="p-6 space-y-5">
                    <div className="rounded-2xl bg-[#153F2D]/[0.03] border border-[#153F2D]/5 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#153F2D]/40">Transfer Record</span>
                        <span className="text-[10px] font-bold text-[#153F2D]/40">{timestamp}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#5DB06D]/10 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-[#5DB06D]" />
                        </div>
                        <div>
                          <p className="font-extrabold text-[#153F2D] text-[15px]">{itemName}</p>
                          <p className="text-[12px] text-[#153F2D]/50 font-bold uppercase tracking-wider">{itemQuantity} {itemUnit}</p>
                        </div>
                      </div>
                    </div>

                    {/* Legal Notice */}
                    <div className="rounded-2xl bg-[#EAB308]/5 border border-[#EAB308]/10 p-4">
                      <p className="text-[11px] font-bold text-[#153F2D]/70 leading-relaxed">
                        This transfer is protected under the <span className="text-[#153F2D] font-extrabold">Bill Emerson Good Samaritan Food Donation Act</span> (42 U.S.C. § 1791).
                        Donors acting in good faith are shielded from civil and criminal liability for donated food.
                      </p>
                    </div>

                    {/* Signature Pad */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#153F2D]/40">Digital Signature</span>
                        {hasSigned && (
                          <button
                            onClick={clearSignature}
                            className="text-[10px] font-bold text-[#D9534F] uppercase tracking-widest hover:text-[#c9302c] transition-colors"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      <div className="rounded-2xl border-2 border-dashed border-[#153F2D]/10 bg-white overflow-hidden relative">
                        <canvas
                          ref={canvasRef}
                          width={432}
                          height={120}
                          className="w-full h-[120px] cursor-crosshair touch-none"
                          onMouseDown={startDraw}
                          onMouseMove={draw}
                          onMouseUp={endDraw}
                          onMouseLeave={endDraw}
                          onTouchStart={startDraw}
                          onTouchMove={draw}
                          onTouchEnd={endDraw}
                        />
                        {!hasSigned && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <p className="text-[13px] text-[#153F2D]/20 font-bold">Sign here</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-6 pt-2 flex gap-3">
                    <button
                      onClick={onClose}
                      className="flex-1 py-4 rounded-xl border border-[#153F2D]/10 text-[#153F2D]/60 font-bold text-[12px] uppercase tracking-widest hover:bg-[#153F2D]/5 transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: hasSigned ? 1.02 : 1 }}
                      whileTap={{ scale: hasSigned ? 0.98 : 1 }}
                      onClick={handleConfirm}
                      disabled={!hasSigned}
                      className={`flex-[2] py-4 rounded-xl font-extrabold text-[12px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                        hasSigned
                          ? 'bg-[#153F2D] text-white shadow-[0_8px_16px_rgba(21,63,45,0.2)] cursor-pointer'
                          : 'bg-[#153F2D]/10 text-[#153F2D]/30 cursor-not-allowed'
                      }`}
                    >
                      <Shield className="w-4 h-4" />
                      Verify & Confirm
                    </motion.button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

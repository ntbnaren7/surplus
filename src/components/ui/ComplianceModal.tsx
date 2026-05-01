"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, X, CheckCircle2, FileText, Thermometer } from "lucide-react"
import { SignaturePad } from "./SignaturePad"

interface ComplianceModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (signatureData: string, temp?: number) => void
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
  const [signatureData, setSignatureData] = useState<string | null>(null)
  const [temperature, setTemperature] = useState<string>("")
  const [confirmed, setConfirmed] = useState(false)

  // Determine if item needs cold chain verification based on name
  const requiresColdChain = /chicken|beef|meat|fish|dairy|milk|cheese|yogurt/i.test(itemName)
  const tempNumber = parseFloat(temperature)
  const isTempInvalid = requiresColdChain && (isNaN(tempNumber) || tempNumber > 41)

  const handleConfirm = () => {
    if (!signatureData) return
    if (requiresColdChain && isTempInvalid) return

    setConfirmed(true)
    setTimeout(() => {
      onConfirm(signatureData, requiresColdChain ? tempNumber : undefined)
      setConfirmed(false)
      setSignatureData(null)
      setTemperature("")
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
            <div className="bg-white rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(21,63,45,0.2)] border border-[#153F2D]/5 w-full max-w-[480px] overflow-hidden max-h-[90vh] flex flex-col">

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
                  <div className="p-6 pb-4 border-b border-[#153F2D]/5 flex items-center justify-between shrink-0">
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
                  <div className="p-6 space-y-5 overflow-y-auto flex-1">
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

                    {/* Cold Chain HACCP Verification */}
                    {requiresColdChain && (
                      <div className={`rounded-2xl border p-4 transition-colors ${isTempInvalid && temperature !== "" ? 'bg-[#D9534F]/5 border-[#D9534F]/20' : 'bg-[#EAB308]/5 border-[#EAB308]/20'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1.5">
                            <Thermometer className={`w-3.5 h-3.5 ${isTempInvalid && temperature !== "" ? 'text-[#D9534F]' : 'text-[#EAB308]'}`} />
                            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#153F2D]">Cold Chain Audit</span>
                          </div>
                          <span className="text-[9px] font-bold uppercase tracking-widest text-[#153F2D]/40">HACCP Req.</span>
                        </div>
                        <p className="text-[12px] font-medium text-[#153F2D]/60 mb-3">
                          Perishable item detected. Enter internal cooler temperature. Must be ≤ 41°F.
                        </p>
                        <div className="flex items-center gap-3">
                          <input 
                            type="number" 
                            value={temperature}
                            onChange={(e) => setTemperature(e.target.value)}
                            placeholder="38"
                            className="bg-white border border-[#153F2D]/10 rounded-xl px-4 py-2 w-24 text-[14px] font-bold text-[#153F2D] outline-none focus:border-[#5DB06D]"
                          />
                          <span className="text-[14px] font-bold text-[#153F2D]/50">°F</span>
                        </div>
                        {isTempInvalid && temperature !== "" && (
                          <p className="text-[11px] font-bold text-[#D9534F] mt-2">
                            Temperature exceeds safe limits (41°F). Delivery cannot be verified.
                          </p>
                        )}
                      </div>
                    )}

                    {/* Legal Notice */}
                    <div className="rounded-2xl bg-white border border-[#153F2D]/5 p-4 shadow-sm">
                      <p className="text-[11px] font-bold text-[#153F2D]/70 leading-relaxed">
                        This transfer is protected under the <span className="text-[#153F2D] font-extrabold">Bill Emerson Good Samaritan Food Donation Act</span> (42 U.S.C. § 1791).
                      </p>
                    </div>

                    {/* Signature Pad */}
                    <SignaturePad 
                      label={actionType === 'pickup' ? "Donor Signature" : "Receiver Signature"}
                      onSignatureChange={setSignatureData} 
                    />
                  </div>

                  {/* Actions */}
                  <div className="p-6 pt-2 flex gap-3 shrink-0">
                    <button
                      onClick={onClose}
                      className="flex-1 py-4 rounded-xl border border-[#153F2D]/10 text-[#153F2D]/60 font-bold text-[12px] uppercase tracking-widest hover:bg-[#153F2D]/5 transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: signatureData && !isTempInvalid ? 1.02 : 1 }}
                      whileTap={{ scale: signatureData && !isTempInvalid ? 0.98 : 1 }}
                      onClick={handleConfirm}
                      disabled={!signatureData || isTempInvalid}
                      className={`flex-[2] py-4 rounded-xl font-extrabold text-[12px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                        signatureData && !isTempInvalid
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

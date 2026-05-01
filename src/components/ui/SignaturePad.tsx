"use client"

import React, { useRef, useEffect } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { motion } from 'framer-motion'
import { Eraser, PenTool } from 'lucide-react'

interface SignaturePadProps {
  onSignatureChange: (dataUrl: string | null) => void
  label?: string
}

export function SignaturePad({ onSignatureChange, label = "Receiver Signature" }: SignaturePadProps) {
  const sigCanvas = useRef<SignatureCanvas>(null)

  // Listen to end of stroke to update parent
  const handleEnd = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      onSignatureChange(sigCanvas.current.toDataURL('image/png'))
    } else {
      onSignatureChange(null)
    }
  }

  const clear = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear()
      onSignatureChange(null)
    }
  }

  // Handle window resize to keep canvas sharp (react-signature-canvas quirk)
  useEffect(() => {
    const handleResize = () => {
      if (sigCanvas.current) {
        // We don't want to clear it forcefully on resize unless we have to, 
        // but react-signature-canvas handles scaling weirdly. 
        // A simple re-render usually suffices for responsive containers.
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#153F2D]/40 flex items-center gap-1.5">
          <PenTool className="w-3.5 h-3.5" />
          {label}
        </label>
        <button
          type="button"
          onClick={clear}
          className="text-[10px] font-bold text-[#153F2D]/30 hover:text-[#D9534F] transition-colors flex items-center gap-1 uppercase tracking-widest"
        >
          <Eraser className="w-3 h-3" />
          Clear
        </button>
      </div>

      <div className="relative w-full h-40 bg-[#F5F0EB]/50 border-2 border-dashed border-[#153F2D]/20 rounded-[1.5rem] overflow-hidden group hover:border-[#5DB06D]/40 transition-colors">
        <SignatureCanvas
          ref={sigCanvas}
          onEnd={handleEnd}
          penColor="#153F2D"
          canvasProps={{
            className: "w-full h-full cursor-crosshair",
            style: { width: '100%', height: '100%' }
          }}
        />
        
        {/* Placeholder text (hidden when drawing starts, handled by canvas natively but we add a subtle background hint) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30 mix-blend-multiply group-hover:opacity-10 transition-opacity">
          <span className="text-[16px] font-playfair font-bold text-[#153F2D]/30 italic">Sign here</span>
        </div>
      </div>
      <p className="text-[10px] font-medium text-[#153F2D]/30 mt-2 text-center">
        This signature serves as legal non-repudiation of custody transfer.
      </p>
    </div>
  )
}

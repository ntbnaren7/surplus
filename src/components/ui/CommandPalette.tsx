"use client"

import { Command } from 'cmdk'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Store, Truck, Heart, FileText, Radio, LogOut, Brain, Home, Zap } from 'lucide-react'

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { profile, signOut } = useAuth()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(o => !o)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const runAction = (fn: () => void) => {
    setOpen(false)
    fn()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-[560px] mx-4"
          >
            <Command className="bg-white rounded-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-[#153F2D]/10 overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-[#153F2D]/5">
                <Search className="w-4 h-4 text-[#153F2D]/30" />
                <Command.Input
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent text-[14px] font-medium text-[#153F2D] placeholder:text-[#153F2D]/30 outline-none"
                />
                <kbd className="text-[10px] font-bold text-[#153F2D]/20 bg-[#153F2D]/5 px-2 py-1 rounded-md">ESC</kbd>
              </div>

              <Command.List className="max-h-[340px] overflow-y-auto p-2">
                <Command.Empty className="py-8 text-center text-[13px] text-[#153F2D]/40 font-medium">
                  No results found.
                </Command.Empty>

                <Command.Group heading="Navigation" className="px-2 py-1.5 text-[9px] font-extrabold uppercase tracking-widest text-[#153F2D]/25">
                  <Command.Item onSelect={() => runAction(() => router.push('/'))} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-[#153F2D] cursor-pointer hover:bg-[#153F2D]/5 data-[selected=true]:bg-[#153F2D]/5">
                    <Home className="w-4 h-4 text-[#153F2D]/40" /> Landing Page
                  </Command.Item>
                  <Command.Item onSelect={() => runAction(() => router.push('/donor'))} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-[#153F2D] cursor-pointer hover:bg-[#153F2D]/5 data-[selected=true]:bg-[#153F2D]/5">
                    <Store className="w-4 h-4 text-[#5DB06D]" /> Donor Dashboard
                  </Command.Item>
                  <Command.Item onSelect={() => runAction(() => router.push('/driver'))} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-[#153F2D] cursor-pointer hover:bg-[#153F2D]/5 data-[selected=true]:bg-[#153F2D]/5">
                    <Truck className="w-4 h-4 text-[#EAB308]" /> Driver Dashboard
                  </Command.Item>
                  <Command.Item onSelect={() => runAction(() => router.push('/receiver'))} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-[#153F2D] cursor-pointer hover:bg-[#153F2D]/5 data-[selected=true]:bg-[#153F2D]/5">
                    <Heart className="w-4 h-4 text-[#7C3AED]" /> Receiver Dashboard
                  </Command.Item>
                  <Command.Item onSelect={() => runAction(() => router.push('/volunteer'))} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-[#153F2D] cursor-pointer hover:bg-[#153F2D]/5 data-[selected=true]:bg-[#153F2D]/5">
                    <Zap className="w-4 h-4 text-[#0EA5E9]" /> Volunteer Dashboard
                  </Command.Item>
                </Command.Group>

                <Command.Separator className="h-px bg-[#153F2D]/5 mx-2 my-1" />

                <Command.Group heading="Actions" className="px-2 py-1.5 text-[9px] font-extrabold uppercase tracking-widest text-[#153F2D]/25">
                  <Command.Item onSelect={() => runAction(() => router.push('/donor'))} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-[#153F2D] cursor-pointer hover:bg-[#153F2D]/5 data-[selected=true]:bg-[#153F2D]/5">
                    <Radio className="w-4 h-4 text-[#5DB06D]" /> Broadcast New Surplus
                  </Command.Item>
                  <Command.Item onSelect={() => runAction(() => router.push('/driver'))} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-[#153F2D] cursor-pointer hover:bg-[#153F2D]/5 data-[selected=true]:bg-[#153F2D]/5">
                    <Brain className="w-4 h-4 text-[#7C3AED]" /> Optimize Routes (AI)
                  </Command.Item>
                  <Command.Item onSelect={() => runAction(() => {})} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-[#153F2D] cursor-pointer hover:bg-[#153F2D]/5 data-[selected=true]:bg-[#153F2D]/5">
                    <FileText className="w-4 h-4 text-[#153F2D]/40" /> View Tax Receipts
                  </Command.Item>
                </Command.Group>

                <Command.Separator className="h-px bg-[#153F2D]/5 mx-2 my-1" />

                <Command.Group heading="Account" className="px-2 py-1.5 text-[9px] font-extrabold uppercase tracking-widest text-[#153F2D]/25">
                  <Command.Item onSelect={() => runAction(async () => { await signOut(); router.push('/login') })} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-[#D9534F] cursor-pointer hover:bg-[#D9534F]/5 data-[selected=true]:bg-[#D9534F]/5">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </Command.Item>
                </Command.Group>
              </Command.List>

              <div className="px-4 py-2.5 border-t border-[#153F2D]/5 flex items-center justify-between">
                <span className="text-[10px] text-[#153F2D]/25 font-bold">
                  {profile ? `Signed in as ${profile.fullName}` : 'Not signed in'}
                </span>
                <div className="flex items-center gap-1.5">
                  <kbd className="text-[9px] font-bold text-[#153F2D]/20 bg-[#153F2D]/5 px-1.5 py-0.5 rounded">↑↓</kbd>
                  <span className="text-[9px] text-[#153F2D]/20">Navigate</span>
                  <kbd className="text-[9px] font-bold text-[#153F2D]/20 bg-[#153F2D]/5 px-1.5 py-0.5 rounded ml-2">↵</kbd>
                  <span className="text-[9px] text-[#153F2D]/20">Select</span>
                </div>
              </div>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

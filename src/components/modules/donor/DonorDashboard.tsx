"use client"

import { useDonor } from "@/hooks/useDonor"
import { getHoursUntilExpiry } from "@/utils/time"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { Clock, Plus, Zap, Package } from "lucide-react"

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 28 } },
}

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

export function DonorDashboardModule() {
  const { activeSurplus, simulateDrop } = useDonor()

  return (
    <motion.div
      className="space-y-10"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* POS Simulation */}
      <motion.div
        variants={fadeUp}
        className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.03] p-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
              <Zap className="w-[18px] h-[18px] text-emerald-400" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-foreground mb-1">POS Integration</h2>
              <p className="text-[13px] text-muted-foreground leading-relaxed max-w-md">
                In production, this hooks directly into Square / Toast. Kitchen closing triggers an automatic surplus drop.
              </p>
            </div>
          </div>
          <Button onClick={simulateDrop} variant="surplus" size="default" className="shrink-0">
            <Plus className="w-4 h-4" />
            Simulate Kitchen Drop
          </Button>
        </div>
      </motion.div>

      {/* Active Inventory */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Active Surplus</h2>
            <p className="text-[13px] text-muted-foreground mt-0.5">Items awaiting matching and dispatch.</p>
          </div>
          <Badge variant="secondary">{activeSurplus.length} items</Badge>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {activeSurplus.map((item) => {
              const hoursToExpiry = getHoursUntilExpiry(item.expiresAt)
              const isUrgent = hoursToExpiry < 3

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className={`glow-border rounded-2xl border bg-white/[0.02] p-5 transition-all duration-300 hover:bg-white/[0.04] ${isUrgent ? 'border-red-500/20' : 'border-white/[0.06]'}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                          <Package className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-[14px] font-medium text-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{item.quantity} {item.unit}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="font-mono">{hoursToExpiry}h remaining</span>
                      </div>
                      {isUrgent && (
                        <Badge variant="destructive" className="animate-breathe">Urgent</Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
          {activeSurplus.length === 0 && (
            <div className="col-span-full py-16 text-center rounded-2xl border border-dashed border-white/[0.06]">
              <Package className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No active surplus. Kitchen is open.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

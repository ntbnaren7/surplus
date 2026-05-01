"use client"

import { useReceiver } from "@/hooks/useReceiver"
import { getHoursUntilExpiry } from "@/utils/time"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { Clock, Navigation, CheckCircle2, Package, Truck } from "lucide-react"

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 28 } },
}

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

export function ReceiverDashboardModule() {
  const { availableItems, incomingItems, claimSurplus } = useReceiver()

  return (
    <motion.div
      className="space-y-14"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* Real-time Match Feed */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Surplus Feed</h2>
            <p className="text-[13px] text-muted-foreground mt-0.5">Matched to your dietary needs and location.</p>
          </div>
          <Badge variant="live" className="gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            Live
          </Badge>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {availableItems.map((item) => {
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
                  <div className={`glow-border rounded-2xl border bg-white/[0.02] p-5 flex flex-col transition-all duration-300 hover:bg-white/[0.04] ${isUrgent ? 'border-red-500/20' : 'border-emerald-500/10'}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/10 flex items-center justify-center">
                          <Package className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-[14px] font-medium text-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{item.quantity} {item.unit}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="font-mono">{hoursToExpiry}h left</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5" />
                        <span className="font-mono">2.4 mi</span>
                      </div>
                      {isUrgent && (
                        <Badge variant="destructive" className="animate-breathe text-[10px] px-2 py-0">Urgent</Badge>
                      )}
                    </div>

                    <Button
                      onClick={() => claimSurplus(item.id)}
                      variant="surplus"
                      size="sm"
                      className="w-full mt-auto"
                    >
                      Claim & Dispatch
                    </Button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
          {availableItems.length === 0 && (
            <div className="col-span-full py-16 text-center rounded-2xl border border-dashed border-white/[0.06]">
              <Package className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Scanning nearby donors…</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Incoming Deliveries */}
      <motion.div variants={fadeUp}>
        <div className="mb-6">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Incoming Deliveries</h2>
          <p className="text-[13px] text-muted-foreground mt-0.5">Track drivers en route to your facility.</p>
        </div>

        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {incomingItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/[0.08] border border-blue-500/10 flex items-center justify-center">
                      <Truck className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-mono">{item.quantity} {item.unit}</span>
                        <span className="mx-1.5 text-white/10">·</span>
                        Driver: Alex M.
                        <span className="mx-1.5 text-white/10">·</span>
                        <span className="font-mono">ETA 12 min</span>
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">In Transit</Badge>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {incomingItems.length === 0 && (
            <div className="py-10 text-center text-[13px] text-muted-foreground">
              No incoming deliveries right now.
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

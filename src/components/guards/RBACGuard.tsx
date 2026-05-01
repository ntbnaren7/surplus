"use client"

import { useAuth, type UserRole } from "@/components/providers/AuthProvider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { motion } from "framer-motion"
import { Shield } from "lucide-react"

/**
 * Role-Based Access Control Guard
 * 
 * Wraps a dashboard page and ensures:
 * 1. The user is authenticated (redirects to /login if not)
 * 2. The user has the correct role (shows access denied if not)
 */
export function RBACGuard({
  children,
  requiredRole,
}: {
  children: React.ReactNode
  requiredRole: UserRole
}) {
  const { user, profile, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-10 h-10 border-3 border-[#153F2D]/20 border-t-[#5DB06D] rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-[12px] font-bold text-[#153F2D]/40 uppercase tracking-widest">Verifying credentials...</p>
        </motion.div>
      </div>
    )
  }

  // Not authenticated
  if (!user) {
    return null // Will redirect in useEffect
  }

  // Wrong role
  if (profile && profile.role !== requiredRole) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#D9534F]/10 flex items-center justify-center mx-auto mb-5">
            <Shield className="w-8 h-8 text-[#D9534F]" />
          </div>
          <h2 className="text-[24px] font-extrabold text-[#153F2D] tracking-tight mb-2">Access Denied</h2>
          <p className="text-[14px] text-[#153F2D]/50 font-medium mb-6">
            Your account is registered as a <strong className="text-[#153F2D]">{profile.role}</strong>. 
            This dashboard requires <strong className="text-[#153F2D]">{requiredRole}</strong> access.
          </p>
          <button
            onClick={() => router.push(`/${profile.role}`)}
            className="bg-[#153F2D] text-white px-6 py-3 rounded-xl text-[12px] font-extrabold uppercase tracking-widest hover:bg-[#0f2d20] transition-colors"
          >
            Go to your dashboard
          </button>
        </motion.div>
      </div>
    )
  }

  return <>{children}</>
}

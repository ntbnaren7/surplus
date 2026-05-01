"use client"

import { useState } from "react"
import { useAuth, type UserRole } from "@/components/providers/AuthProvider"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { LogIn, UserPlus, Truck, Store, Heart, Zap, ArrowRight, Shield, Brain, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

const ROLES: { id: UserRole; label: string; icon: typeof Truck; desc: string; color: string }[] = [
  { id: 'donor', label: 'Donor', icon: Store, desc: 'Restaurant, Grocery, Catering', color: '#5DB06D' },
  { id: 'driver', label: 'Driver', icon: Truck, desc: 'Logistics & Fleet Operator', color: '#EAB308' },
  { id: 'receiver', label: 'Receiver', icon: Heart, desc: 'Food Bank, Shelter, NGO', color: '#7C3AED' },
  { id: 'volunteer', label: 'Volunteer', icon: Zap, desc: 'Community Rescue Hub', color: '#0EA5E9' },
]

export default function LoginPage() {
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [selectedRole, setSelectedRole] = useState<UserRole>('donor')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      if (mode === 'login') {
        const result = await signIn(email, password)
        if (result.error) {
          setError(result.error)
        } else {
          // Redirect handled by auth state change — go to role dashboard
          router.push(`/${selectedRole}`)
        }
      } else {
        const result = await signUp(email, password, selectedRole, fullName)
        if (result.error) {
          setError(result.error)
        } else {
          router.push(`/${selectedRole}`)
        }
      }
    } catch {
      setError('An unexpected error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#5DB06D]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#7C3AED]/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px] relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-5">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.5C12 21.5 3 16 3 9.5C3 6.46243 5.46243 4 8.5 4C10.086 4 11.5165 4.67139 12 5.74239C12.4835 4.67139 13.914 4 15.5 4C18.5376 4 21 6.46243 21 9.5C21 16 12 21.5 12 21.5Z" fill="#153F2D"/>
              <path d="M12 21.5C12 21.5 3 16 3 9.5C3 6.46243 5.46243 4 8.5 4C10.086 4 11.5165 4.67139 12 5.74239L12 21.5Z" fill="#5DB06D"/>
            </svg>
            <span className="text-[24px] font-bold text-[#153F2D] tracking-tight">Surplus</span>
          </Link>
          <h1 className="text-[28px] font-extrabold text-[#153F2D] tracking-tight">
            {mode === 'login' ? 'Welcome back' : 'Join the mission'}
          </h1>
          <p className="text-[14px] text-[#153F2D]/50 font-medium mt-1.5">
            {mode === 'login' ? 'Sign in to your dashboard' : 'Create your account and start saving food'}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-[2rem] bg-white/80 backdrop-blur-2xl border border-[#153F2D]/[0.06] shadow-[0_8px_30px_-12px_rgba(21,63,45,0.08)] p-8">

          {/* Role Selector (signup only, but useful on login to know which dashboard) */}
          <div className="mb-6">
            <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#153F2D]/40 mb-3 block">
              {mode === 'login' ? 'Dashboard' : 'Your Role'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map((role) => {
                const Icon = role.icon
                const isSelected = selectedRole === role.id
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={`flex flex-col items-center gap-1.5 py-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-[#153F2D] bg-[#153F2D] text-white shadow-[0_8px_16px_rgba(21,63,45,0.2)]'
                        : 'border-[#153F2D]/10 bg-white/40 text-[#153F2D]/60 hover:bg-white/80'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[11px] font-extrabold uppercase tracking-widest">{role.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name (signup only) */}
            <AnimatePresence>
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#153F2D]/40 mb-2 block">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    required={mode === 'signup'}
                    className="w-full bg-transparent border-b-2 border-[#153F2D]/10 pb-3 text-[16px] font-bold text-[#153F2D] placeholder:text-[#153F2D]/20 focus:outline-none focus:border-[#5DB06D] transition-colors"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#153F2D]/40 mb-2 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@organization.com"
                required
                className="w-full bg-transparent border-b-2 border-[#153F2D]/10 pb-3 text-[16px] font-bold text-[#153F2D] placeholder:text-[#153F2D]/20 focus:outline-none focus:border-[#5DB06D] transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#153F2D]/40 mb-2 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-transparent border-b-2 border-[#153F2D]/10 pb-3 text-[16px] font-bold text-[#153F2D] placeholder:text-[#153F2D]/20 focus:outline-none focus:border-[#5DB06D] transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 bottom-3 text-[#153F2D]/30 hover:text-[#153F2D]/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[12px] font-bold text-[#D9534F] bg-[#D9534F]/10 rounded-lg px-4 py-2.5"
              >
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full relative group overflow-hidden bg-[#153F2D] text-white rounded-2xl py-4.5 shadow-[0_16px_32px_-8px_rgba(21,63,45,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
              {isSubmitting ? (
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                />
              ) : (
                <>
                  {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  <span className="text-[13px] font-extrabold tracking-widest uppercase">
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Toggle mode */}
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null) }}
              className="text-[13px] font-bold text-[#153F2D]/50 hover:text-[#153F2D] transition-colors"
            >
              {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 mt-6 text-[#153F2D]/30">
          <Shield className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-widest">End-to-end encrypted • SOC-2 compliant</span>
        </div>
      </motion.div>
    </div>
  )
}

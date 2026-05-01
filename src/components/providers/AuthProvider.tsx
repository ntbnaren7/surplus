"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

/* ─── Role Types ─── */
export type UserRole = 'donor' | 'driver' | 'receiver' | 'volunteer'

export interface UserProfile {
  id: string
  email: string
  role: UserRole
  fullName: string
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, role: UserRole, fullName: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

/* ═══════════════════════════════════════════════════
   AUTH PROVIDER — wraps the entire app
═══════════════════════════════════════════════════ */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  /* ─── Fetch profile from Supabase ─── */
  const fetchProfile = useCallback(async (userId: string, email: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (data && !error) {
      setProfile({
        id: data.id,
        email: email,
        role: data.role as UserRole,
        fullName: data.full_name ?? email.split('@')[0],
      })
    } else {
      // Profile doesn't exist yet — this is a new sign-up
      // We'll create it during sign-up, so just set a fallback
      setProfile(null)
    }
  }, [])

  /* ─── Listen for auth state changes ─── */
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      setUser(s?.user ?? null)
      if (s?.user) {
        fetchProfile(s.user.id, s.user.email ?? '')
      }
      setIsLoading(false)
    })

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      setUser(s?.user ?? null)
      if (s?.user) {
        fetchProfile(s.user.id, s.user.email ?? '')
      } else {
        setProfile(null)
      }
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  /* ─── Sign In ─── */
  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    return { error: null }
  }, [])

  /* ─── Sign Up (with profile creation) ─── */
  const signUp = useCallback(async (email: string, password: string, role: UserRole, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return { error: error.message }

    // Create profile row
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        email,
        role,
        full_name: fullName,
      })
      if (profileError) {
        console.error('[Auth] Profile creation error:', profileError)
      } else {
        setProfile({ id: data.user.id, email, role, fullName })
      }
    }

    return { error: null }
  }, [])

  /* ─── Sign Out ─── */
  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setSession(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, session, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

/* ─── Hook ─── */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

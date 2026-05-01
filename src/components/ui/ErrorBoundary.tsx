"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallbackTitle?: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Global Error Boundary
 * 
 * Catches runtime errors in any child component tree and replaces
 * the crashed section with a sleek "System Anomaly" card rather
 * than crashing the entire page.
 */
export class GlobalErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught:', error, errorInfo)
    // In production: Send to Sentry/PostHog
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback title={this.props.fallbackTitle} onRetry={() => this.setState({ hasError: false, error: null })} />
    }
    return this.props.children
  }
}

function ErrorFallback({ title, onRetry }: { title?: string; onRetry: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-[2rem] bg-white/80 backdrop-blur-2xl border border-[#D9534F]/10 shadow-[0_8px_30px_-12px_rgba(217,83,79,0.1)] p-8 flex flex-col items-center justify-center min-h-[200px]"
    >
      <div className="w-14 h-14 rounded-2xl bg-[#D9534F]/10 flex items-center justify-center mb-4">
        <AlertTriangle className="w-7 h-7 text-[#D9534F]" />
      </div>
      <h3 className="text-[16px] font-extrabold text-[#153F2D] tracking-tight mb-1">
        {title ?? 'System Anomaly'}
      </h3>
      <p className="text-[12px] text-[#153F2D]/40 font-medium text-center max-w-[280px] mb-5">
        This module encountered an unexpected error. Your data is safe.
      </p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 bg-[#153F2D] text-white px-5 py-2.5 rounded-xl text-[11px] font-extrabold uppercase tracking-widest hover:bg-[#0f2d20] transition-colors"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Reload Module
      </button>
    </motion.div>
  )
}

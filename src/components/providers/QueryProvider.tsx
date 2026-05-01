"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'

/**
 * TanStack Query Provider
 * 
 * Configures React Query with production-ready defaults:
 * - 5 minute stale time (reduces unnecessary refetches)
 * - 3 retry attempts on failure
 * - Refetch on window focus (catches stale data when user returns)
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,        // 5 minutes
        gcTime: 10 * 60 * 1000,           // 10 minutes garbage collection
        retry: 3,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 2,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

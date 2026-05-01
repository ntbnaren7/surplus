"use client"

import Link from "next/link";
import { ArrowLeft, LogOut, Command } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { GlobalErrorBoundary } from "@/components/ui/ErrorBoundary";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const roleColor = profile?.role === 'donor' ? '#5DB06D' : profile?.role === 'driver' ? '#EAB308' : '#7C3AED';

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0EB] text-[#1A3C34]">
      {/* Background Vignette & Noise */}
      <div className="fixed inset-0 vignette pointer-events-none z-0" />
      <div className="fixed inset-0 glass-noise opacity-50 pointer-events-none z-0" />

      <header className="px-8 h-16 flex items-center justify-between border-b border-[#1A3C34]/5 backdrop-blur-2xl sticky top-0 z-50 bg-[#F5F0EB]/80">
        <Link 
          href="/" 
          className="flex items-center gap-2.5 text-[13px] font-medium text-[#1A3C34]/60 hover:text-[#1A3C34] transition-colors duration-300"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Platform
        </Link>
        <div className="flex items-center gap-4">
          {/* User Profile Chip */}
          {profile && (
            <div className="flex items-center gap-2.5 bg-white/60 backdrop-blur-xl rounded-full pl-1.5 pr-4 py-1.5 border border-[#1A3C34]/5">
              <div 
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-extrabold"
                style={{ backgroundColor: roleColor }}
              >
                {profile.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[#153F2D] leading-tight">{profile.fullName}</span>
                <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: roleColor }}>{profile.role}</span>
              </div>
            </div>
          )}
          {/* CMD+K Hint */}
          <div className="hidden md:flex items-center gap-1.5 bg-[#153F2D]/5 rounded-lg px-2.5 py-1.5 cursor-pointer hover:bg-[#153F2D]/10 transition-colors" onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}>
            <Command className="w-3 h-3 text-[#153F2D]/30" />
            <span className="text-[10px] font-bold text-[#153F2D]/30">K</span>
          </div>
          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-[11px] font-bold text-[#153F2D]/40 hover:text-[#D9534F] transition-colors uppercase tracking-widest"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </header>
      <main className="flex-1">
        <GlobalErrorBoundary>
          {children}
        </GlobalErrorBoundary>
      </main>
      <CommandPalette />
    </div>
  );
}

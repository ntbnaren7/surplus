import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm ring-1 ring-black/5">
            <span className="font-bold text-[#1A3C34] text-[14px] leading-none -mt-0.5" style={{ fontFamily: 'var(--font-playfair)' }}>S</span>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

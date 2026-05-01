import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background bg-grid">
      <header className="px-8 h-14 flex items-center justify-between border-b border-white/[0.04] backdrop-blur-xl sticky top-0 z-50">
        <Link 
          href="/" 
          className="flex items-center gap-2.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Platform
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md bg-surplus flex items-center justify-center">
            <span className="font-bold text-surplus-foreground text-[10px] leading-none">S</span>
          </div>
          <span className="text-[13px] font-medium text-muted-foreground">Surplus</span>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

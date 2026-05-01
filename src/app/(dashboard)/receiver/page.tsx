"use client"

import { ReceiverDashboardModule } from "@/components/modules/receiver/ReceiverDashboard"
import { RBACGuard } from "@/components/guards/RBACGuard"

export default function ReceiverDashboard() {
  return (
    <RBACGuard requiredRole="receiver">
      <div className="px-8 pt-4 pb-10 max-w-6xl mx-auto">
        <div className="mb-2">
          <p className="text-[13px] font-medium text-[#5DB06D] mb-1 tracking-wide uppercase">Receiver</p>
          <h1 className="text-3xl font-extrabold tracking-[-0.02em] text-[#153F2D]">Incoming Feed</h1>
          <p className="text-[15px] text-[#153F2D]/60 mt-1 font-medium">Claim surplus and track deliveries in real-time.</p>
        </div>
        
        <ReceiverDashboardModule />
      </div>
    </RBACGuard>
  );
}

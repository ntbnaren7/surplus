import { DriverDashboardModule } from "@/components/modules/driver/DriverDashboard"

export default function DriverDashboard() {
  return (
    <div className="px-8 pt-10 pb-10 max-w-7xl mx-auto">
      <div className="mb-10">
        <p className="text-[13px] font-extrabold text-[#153F2D]/50 mb-2 tracking-widest uppercase">Logistics</p>
        <h1 className="text-3xl font-extrabold tracking-[-0.03em] text-[#153F2D]">Route View</h1>
        <p className="text-[15px] font-medium text-[#153F2D]/60 mt-1.5">Expiry-optimized multi-stop routing.</p>
      </div>
      
      <DriverDashboardModule />
    </div>
  );
}

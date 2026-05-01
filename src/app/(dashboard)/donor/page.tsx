import { DonorDashboardModule } from "@/components/modules/donor/DonorDashboard"

export default function DonorDashboard() {
  return (
    <div className="px-8 pt-4 pb-10 max-w-6xl mx-auto">
      <div className="mb-2">
        <p className="text-[13px] font-medium text-[#5DB06D] mb-1 tracking-wide uppercase">Donor</p>
        <h1 className="text-3xl font-extrabold tracking-[-0.02em] text-[#153F2D]">Dashboard</h1>
        <p className="text-[15px] text-[#153F2D]/60 mt-1 font-medium">Manage surplus inventory and track your impact.</p>
      </div>
      
      <DonorDashboardModule />
    </div>
  );
}

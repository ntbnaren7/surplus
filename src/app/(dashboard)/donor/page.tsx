import { DonorDashboardModule } from "@/components/modules/donor/DonorDashboard"

export default function DonorDashboard() {
  return (
    <div className="px-8 py-10 max-w-6xl mx-auto">
      <div className="mb-10">
        <p className="text-[13px] font-medium text-surplus mb-2 tracking-wide uppercase">Donor</p>
        <h1 className="text-3xl font-bold tracking-[-0.02em] text-foreground">Dashboard</h1>
        <p className="text-[15px] text-muted-foreground mt-1.5">Manage surplus inventory and track your impact.</p>
      </div>
      
      <DonorDashboardModule />
    </div>
  );
}

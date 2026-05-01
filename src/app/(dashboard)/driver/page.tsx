import { DriverDashboardModule } from "@/components/modules/driver/DriverDashboard"

export default function DriverDashboard() {
  return (
    <div className="px-8 py-10 max-w-7xl mx-auto">
      <div className="mb-10">
        <p className="text-[13px] font-medium text-surplus mb-2 tracking-wide uppercase">Logistics</p>
        <h1 className="text-3xl font-bold tracking-[-0.02em] text-foreground">Route View</h1>
        <p className="text-[15px] text-muted-foreground mt-1.5">Expiry-optimized multi-stop routing.</p>
      </div>
      
      <DriverDashboardModule />
    </div>
  );
}

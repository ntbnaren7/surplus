import { ReceiverDashboardModule } from "@/components/modules/receiver/ReceiverDashboard"

export default function ReceiverDashboard() {
  return (
    <div className="px-8 py-10 max-w-6xl mx-auto">
      <div className="mb-10">
        <p className="text-[13px] font-medium text-surplus mb-2 tracking-wide uppercase">Receiver</p>
        <h1 className="text-3xl font-bold tracking-[-0.02em] text-foreground">Incoming Feed</h1>
        <p className="text-[15px] text-muted-foreground mt-1.5">Claim surplus and track deliveries in real-time.</p>
      </div>
      
      <ReceiverDashboardModule />
    </div>
  );
}

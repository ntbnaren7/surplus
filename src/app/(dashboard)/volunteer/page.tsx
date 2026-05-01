import { RBACGuard } from "@/components/guards/RBACGuard"
import { VolunteerDashboard } from "@/components/modules/volunteer/VolunteerDashboard"

export default function VolunteerPage() {
  return (
    <RBACGuard requiredRole="volunteer">
      <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
        <div className="mb-8">
          <h1 className="text-[32px] font-extrabold text-[#153F2D] tracking-tight">Rescue Hub</h1>
          <p className="text-[14px] font-medium text-[#153F2D]/60 mt-1">
            Community food rescue operations and impact tracking.
          </p>
        </div>
        <VolunteerDashboard />
      </main>
    </RBACGuard>
  )
}

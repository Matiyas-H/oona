import { DashboardHeader } from "@/public/images/blog/components/dashboard/header";
import { DashboardShell } from "@/public/images/blog/components/dashboard/shell";
import { CardSkeleton } from "@/public/images/blog/components/shared/card-skeleton";

export default function DashboardBillingLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Billing"
        text="Manage billing and your subscription plan."
      />
      <div className="grid gap-10">
        <CardSkeleton />
      </div>
    </DashboardShell>
  );
}

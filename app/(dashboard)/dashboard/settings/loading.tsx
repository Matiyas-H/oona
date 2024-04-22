import { DashboardHeader } from "@/public/images/blog/components/dashboard/header";
import { DashboardShell } from "@/public/images/blog/components/dashboard/shell";
import { CardSkeleton } from "@/public/images/blog/components/shared/card-skeleton";

export default function DashboardSettingsLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Manage account and website settings."
      />
      <div className="grid gap-10">
        <CardSkeleton />
      </div>
    </DashboardShell>
  );
}

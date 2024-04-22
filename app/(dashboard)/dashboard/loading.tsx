import { DashboardHeader } from "@/public/images/blog/components/dashboard/header";
import { DashboardShell } from "@/public/images/blog/components/dashboard/shell";
import { CardSkeleton } from "@/public/images/blog/components/shared/card-skeleton";
import { Button } from "@/public/images/blog/components/ui/button";

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Posts" text="Create and manage posts.">
        <Button>Create your first Oona agent</Button>
      </DashboardHeader>
      <div className="divide-border-200 divide-y rounded-md border">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </DashboardShell>
  );
}

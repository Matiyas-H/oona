import { redirect } from "next/navigation";
import { DashboardHeader } from "@/public/images/blog/components/dashboard/header";
import { DashboardShell } from "@/public/images/blog/components/dashboard/shell";
import { EmptyPlaceholder } from "@/public/images/blog/components/shared/empty-placeholder";
import { Button } from "@/public/images/blog/components/ui/button";

import { getCurrentUser } from "@/lib/session";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Panel" text="Create and manage content.">
        <Button>Create Oona</Button>
      </DashboardHeader>
      <div>
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="post" />
          <EmptyPlaceholder.Title>No Oona created</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have any agent yet.
          </EmptyPlaceholder.Description>
          <Button variant="outline">Talk to sales</Button>
        </EmptyPlaceholder>
      </div>
    </DashboardShell>
  );
}

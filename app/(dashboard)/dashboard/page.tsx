import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

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
        <Button>Create Omnia</Button>
      </DashboardHeader>
      <div>
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="post" />
          <EmptyPlaceholder.Title>
            No Omnia agent created
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have any agent yet.
          </EmptyPlaceholder.Description>
          <Link href="/pricing">
            <Button variant="outline">Talk to sales</Button>
          </Link>
        </EmptyPlaceholder>
      </div>
    </DashboardShell>
  );
}

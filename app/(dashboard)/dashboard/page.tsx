import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { AIConfigItem } from "@/components/ai-config/ai-config-item";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

export const metadata = {
  title: "Dashboard",
};

async function getAIConfigs(userId: string) {
  return await prisma.aIConfig.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      greeting: true,
      context: true,
      questions: true,
      userNumbers: {
        select: {
          telyxNumber: true,
          aiConfigId: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user?.id) return redirect("/login");

  const configs = await getAIConfigs(user.id);
  const modifiedConfigs = configs.map((config) => ({
    ...config,
    questions: config.questions || null, // Ensure questions is string | null
  }));

  return (
    <DashboardShell>
      <DashboardHeader heading="AI Assistants" text="Manage your AI assistants">
        <Link href="/dashboard/ai-config">
          <Button>
            <Plus className="mr-2 size-4" />
            New Assistant
          </Button>
        </Link>
      </DashboardHeader>

      <div>
        {modifiedConfigs.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {modifiedConfigs.map((config) => (
              <AIConfigItem
                key={config.id}
                id={config.id}
                onDelete={() => {}} // Add empty onDelete for dashboard view
              />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="add" />
            <EmptyPlaceholder.Title>No AI assistants</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              Create your first AI assistant to get started.
            </EmptyPlaceholder.Description>
            <Link href="/dashboard/ai-config">
              <Button>Create Assistant</Button>
            </Link>
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  );
}

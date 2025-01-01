import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

import { AIConfigDisplay } from "./ai-config/page";

export const metadata = {
  title: "Dashboard",
};

interface UserNumber {
  id: string;
  telyxNumber: string;
  aiGreeting: string | null;
  aiContext: string | null;
  userName: string | null; // Add this
  aiQuestions: string | null;
}

interface AIConfigDisplayProps {
  userNumber: UserNumber;
  hasConfiguration: boolean;
}

async function getUserNumber(userId: string) {
  return await prisma.userNumber.findFirst({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      telyxNumber: true,
      aiGreeting: true,
      aiContext: true,
      userName: true, // Add this
      aiQuestions: true, // Add this
    },
  });
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user?.id) return null;

  const userNumber = await getUserNumber(user.id);
  const hasConfiguration = Boolean(
    userNumber?.aiGreeting && userNumber?.aiContext,
  );

  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Configure your AI assistant">
        {/* <Button>Create Omnia</Button> */}
      </DashboardHeader>
      <div>
        {/* <EmptyPlaceholder>
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
        </EmptyPlaceholder> */}

        {userNumber ? (
          <AIConfigDisplay
            userNumber={userNumber}
            hasConfiguration={hasConfiguration}
          />
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="post" />
            <EmptyPlaceholder.Title>
              No phone number found
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You need to set up a phone number before configuring your AI
              assistant.
            </EmptyPlaceholder.Description>
            <Link href="/dashboard/verify" passHref>
              <Button variant="outline">Set Up Phone Number</Button>
            </Link>
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  );
}

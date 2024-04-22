import { redirect } from "next/navigation";
import { BillingInfo } from "@/public/images/blog/components/billing-info";
import { DashboardHeader } from "@/public/images/blog/components/dashboard/header";
import { DashboardShell } from "@/public/images/blog/components/dashboard/shell";
import { Icons } from "@/public/images/blog/components/shared/icons";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/public/images/blog/components/ui/alert";

import { getCurrentUser } from "@/lib/session";
import { getUserSubscriptionPlan } from "@/lib/subscription";

export const metadata = {
  title: "Billing",
  description: "Manage billing and your subscription plan.",
};

export default async function BillingPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const subscriptionPlan = await getUserSubscriptionPlan(user.id);

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Billing"
        text="Manage billing and your subscription plan."
      />
      <div className="grid gap-8">
        <Alert className="!pl-14">
          <Icons.warning />
          <AlertTitle>Onna ai is getting a new payment provider.</AlertTitle>
          <AlertDescription>
            We are migrating from the previous payment provider. please feel
            free to use stripe test cards.
            <a
              href="https://stripe.com/docs/testing#cards"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-8"
            >
              Stripe docs
            </a>
            .
          </AlertDescription>
        </Alert>
        <BillingInfo subscriptionPlan={subscriptionPlan} />
      </div>
    </DashboardShell>
  );
}

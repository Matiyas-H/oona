import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BillingInfo } from "@/components/billing-info";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { Icons } from "@/components/shared/icons";

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
          <AlertTitle>Omnia ai is getting a new payment provider.</AlertTitle>
          <AlertDescription>
            We are migrating from the previous payment provider.
            {/* <a
              href="https://stripe.com/docs/testing#cards"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-8"
            >
              Stripe docs
            </a> */}
            .
          </AlertDescription>
        </Alert>
        <BillingInfo subscriptionPlan={subscriptionPlan} />
      </div>
    </DashboardShell>
  );
}

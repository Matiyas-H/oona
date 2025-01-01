// app/protected/dashboard/verify/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";

import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { VerificationForm } from "./verification-form";

export default async function VerifyPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/login");
  }

  // Check if user already has a verified number
  const existingVerification = await prisma.verifiedNumber.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  if (existingVerification) {
    redirect("/dashboard/service");
  }

  // Fetch countries and carriers
  const countries = await prisma.country.findMany({
    where: {
      active: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const carriers = await prisma.carrier.findMany({
    where: {
      active: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="container max-w-2xl py-6">
      <Card>
        <CardHeader>
          <CardTitle>Verify Your Phone Number</CardTitle>
        </CardHeader>
        <CardContent>
          <VerificationForm countries={countries} carriers={carriers} />
        </CardContent>
      </Card>
    </div>
  );
}

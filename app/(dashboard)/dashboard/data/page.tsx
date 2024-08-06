// File: app/dashboard/data/page.tsx
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DataFetchingComponent } from "@/components/dashboard/data-fetching-component";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";

export const metadata = {
  title: "Call Data",
  description: "View and manage your call data.",
};

async function getCallData() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/calldata?limit=5`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API response error:", res.status, errorText);
      throw new Error(`Failed to fetch data: ${res.status} ${errorText}`);
    }

    const data = await res.json();
    console.log("Fetched data:", data); // Log the fetched data
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export default async function DataPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  let initialCallData;
  let error;

  try {
    initialCallData = await getCallData();
  } catch (e) {
    error = e instanceof Error ? e.message : "An unknown error occurred";
    console.error("Error in DataPage:", e);
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Call Data"
        text="View and manage your recent call data."
      />
      <div className="grid gap-8">
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <DataFetchingComponent initialData={initialCallData} />
        )}
      </div>
    </DashboardShell>
  );
}

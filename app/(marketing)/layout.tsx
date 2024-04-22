import { Suspense } from "react";
<<<<<<< HEAD

import { marketingConfig } from "@/config/marketing";
import { getCurrentUser } from "@/lib/session";
import { NavBar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
=======
import { NavBar } from "@/public/images/blog/components/layout/navbar";
import { SiteFooter } from "@/public/images/blog/components/layout/site-footer";

import { marketingConfig } from "@/config/marketing";
import { getCurrentUser } from "@/lib/session";
>>>>>>> 0806dbcc9278516826f837e573909ef3e1ba71ba

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback="...">
        <NavBar user={user} items={marketingConfig.mainNav} scroll={true} />
      </Suspense>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

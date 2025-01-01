import { DashboardConfig } from "types"

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Documentation",
      href: "/docs",
      disabled: true,
    },
    {
      title: "Support",
      href: "/support",
      disabled: true,
    },
  ],
  sidebarNav: [
    {
      title: "Panel",
      href: "/dashboard",
      icon: "post",
    },
  {
      title: "setup",
      href: "/dashboard/verify",
      icon: "settings",
    },
    {
      title: "Billing",
      href: "/dashboard/billing",
      icon: "billing",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
    },
    {
      title: "Call Data",
      href: "/dashboard/data",
      icon: "post",  // You might need to add this icon to your Icons component
    },
  ],
}

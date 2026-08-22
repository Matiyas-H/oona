import { MarketingConfig } from "types"

export const marketingConfig: MarketingConfig = {
  mainNav: [
    {
      // Documentation lives on its own Mintlify-hosted subdomain, so this is an
      // absolute URL rather than a route. next/link handles that fine; the
      // active-segment check in main-nav simply never matches, which is correct.
      title: "Docs",
      href: "https://guide.omnia-voice.com",
    },
    {
      title: "Pricing",
      href: "/pricing",
    },
    {
      title: "Partners",
      href: "/partners",
    },
    {
      title: "Blog",
      href: "/blog",
    },
  ],
}
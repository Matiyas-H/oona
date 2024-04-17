import Link from "next/link";

import { env } from "@/env.mjs";
import { siteConfig } from "@/config/site";
import { cn, nFormatter } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

export async function HeroLanding() {
  // const { stargazers_count: stars } = await fetch("#", {
  //   ...(env.GITHUB_OAUTH_TOKEN && {
  //     headers: {
  //       Authorization: `Bearer ${process.env.GITHUB_OAUTH_TOKEN}`,
  //       "Content-Type": "application/json",
  //     },
  //   }),
  //   // data will revalidate every hour
  //   next: { revalidate: 3600 },
  // })
  //   .then((res) => res.json())
  //   .catch((e) => console.log(e));

  return (
    <section className="space-y-6 py-12 sm:py-20 lg:py-20">
      <div className="container flex max-w-5xl flex-col items-center gap-5 text-center">
        <Link
          href=""
          className={cn(
            buttonVariants({ variant: "outline", size: "sm", rounded: "full" }),
            "px-4",
          )}
          target="_blank"
        >
          <span className="mr-3">🎉</span> We are a part of Antler NOR-6 batch{" "}
          {/* <Icons.twitter className="ml-2 size-3.5" /> */}
        </Link>

        <h1 className="text-balance font-urban text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-[66px]">
          Conversations That Feel Human,{" "}
          <span className="text-gradient_indigo-purple font-extrabold">
            Results That Transform Your Business
          </span>
        </h1>

        <p
          className="max-w-2xl text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8"
          style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
        >
          Oona understands multiple languages, integrates with your systems, and
          gets things done – instantly.
        </p>

        <div
          className="flex justify-center space-x-2 md:space-x-4"
          style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
        >
          <Link
            href="/pricing"
            className={cn(
              buttonVariants({ size: "lg", rounded: "full" }),
              "gap-2",
            )}
          >
            <span>Go Pricing</span>
            <Icons.arrowRight className="size-4" />
          </Link>
          <Link
            href="#"
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "lg",
                rounded: "full",
              }),
              "px-5",
            )}
          >
            <span>Get started</span>
            <Icons.arrowRight className="size-4" />
          </Link>
          <Link
            href="+358454903036"
            target="_blank"
            rel="noreferrer"
            // className={cn(
            //   buttonVariants({
            //     variant: "outline",
            //     size: "lg",
            //     rounded: "full",
            //   }),
            //   "px-5",
            // )}
          ></Link>
        </div>
      </div>
    </section>
  );
}

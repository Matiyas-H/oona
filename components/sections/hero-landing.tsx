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
          href="https://www.antler.co/location/finland"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm", rounded: "full" }),
            "px-4",
          )}
          target="_blank"
        >
          <span className="mr-3">🎉</span> We are a part of Antler NOR6 🚀
        </Link>

        <h1 className="text-balance font-urban text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-[66px]">
          Transform Your Customer Service with{" "}
          <span className="text-gradient_indigo-purple font-extrabold">
            Omnia Phone AI
          </span>
        </h1>

        <p
          className="max-w-2xl text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8"
          style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
        >
          Focus on your business while we handle the technology. Our end-to-end
          voice AI solution revolutionizes your customer experience.
        </p>

        <div
          className="flex justify-center space-x-2 md:space-x-4"
          style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
        >
          <Link
            href="/pricing"
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "lg",
                rounded: "full",
              }),
              "gap-2",
            )}
          >
            <span>Talk to sales</span>
            <Icons.arrowRight className="size-4" />
          </Link>
          <Link
            href=""
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({
                size: "lg",
                rounded: "full",
              }),
              "px-5",
            )}
          >
            <span>Try Omnia</span>
            <Icons.arrowRight className="size-4" />
          </Link>
          <Link
            href="#"
            target=""
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

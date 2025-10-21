"use client";

import Link from "next/link";
import { PhoneOff } from "lucide-react";

import { siteConfig } from "@/config/site";
import { cn, nFormatter } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/shared/icons";
import { LiveKitVoice } from "@/components/voice/livekit-voice";

import { BentoGrid } from "./bentogrid";
import { Features } from "./features";
import { InfoLanding } from "./info-landing";
import { Powered } from "./powered";
import { Testimonials } from "./testimonials";

export function HeroLanding() {
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
    <>
      <section className="space-y-6 py-16 sm:py-24 lg:py-28">
        <div className="container flex max-w-screen-md flex-col items-center gap-5 text-center">
          {/* <Link
            href=""
            className={cn(
              buttonVariants({ variant: "outline", size: "sm", rounded: "xl" }),
              "border-purple-200 bg-purple-50 px-4 text-purple-700 hover:bg-purple-100 dark:border-purple-800 dark:bg-purple-900/10 dark:text-purple-300 dark:hover:bg-purple-900/20",
            )}
            target="_blank"
          >
            {/* <span className="mr-1 flex items-center gap-1.5">
              <Icons.sparkles className="size-4" />
              Audio-Native Voice AI — Live Now
            </span> */}
          {/* </Link>  */}

          <h1 className="font-satoshi text-balance text-4xl font-black leading-[1.15] tracking-tight sm:text-5xl md:text-6xl md:leading-[1.15] lg:text-7xl">
            The Infrastructure for{" "}
            <span className="whitespace-nowrap text-foreground">Real-Time Voice AI</span>
          </h1>

          <p className="max-w-2xl text-balance text-base text-muted-foreground sm:text-lg md:text-xl">
            One architecture, no vendor dependencies. Deploy voice agents that
            listen and respond instantly.
          </p>

          <div className="flex w-full flex-col items-center gap-4">
            <div className="flex w-full flex-row flex-wrap items-center justify-center gap-3">
              <LiveKitVoice
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "rounded-xl transition-transform duration-200 hover:scale-105",
                )}
              />

              <div className="relative">
                <span className="absolute -top-2 right-0 z-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 px-1.5 py-0.5 text-[10px] font-medium text-white shadow-sm">
                  Free
                </span>
                <Link
                  href="https://dashboard.omnia-voice.com/login"
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "flex justify-center gap-1 rounded-xl px-4 text-sm transition-transform duration-200 hover:scale-105",
                  )}
                >
                  <Icons.sparkles className="size-4" />
                  <span>Get Started</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

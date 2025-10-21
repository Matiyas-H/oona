"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";
import { LiveKitVoice } from "@/components/voice/livekit-voice";

interface Hero115Props {
  icon?: React.ReactNode;
  heading?: string;
  description?: string;
  trustText?: string;
}

const Hero115 = ({
  icon,
  heading = "Real-Time Voice AI, Hosted for Speed — Portable for Control.",
  description = "Launch Omnia’s managed audio-native stack in minutes to power human-like conversations with ~250 ms first-token response. When compliance or scale demand it, move the same real-time pipeline into your own cloud—available under our enterprise tier.",
  trustText = "Hosted from $0.05 per minute. Enterprise self-host available.",
}: Hero115Props) => {
  return (
    <section className="overflow-hidden py-32">
      <div className="container">
        <div className="flex flex-col gap-5">
          <div className="relative flex flex-col gap-5">
            <div
              style={{
                transform: "translate(-50%, -50%)",
              }}
              className="absolute left-1/2 top-1/2 -z-10 mx-auto size-[800px] rounded-full border p-16 [mask-image:linear-gradient(to_top,transparent,transparent,white,white,white,transparent,transparent)] md:size-[1300px] md:p-32"
            >
              <div className="size-full rounded-full border p-16 md:p-32">
                <div className="size-full rounded-full border"></div>
              </div>
            </div>
            {icon && (
              <span className="mx-auto flex size-16 items-center justify-center rounded-full border md:size-20">
                {icon}
              </span>
            )}
            <h2 className="mx-auto max-w-5xl text-balance text-center text-3xl font-medium md:text-6xl">
              {heading}
            </h2>
            <p className="mx-auto max-w-3xl text-center text-muted-foreground md:text-lg">
              {description}
            </p>
            <div className="flex flex-col items-center justify-center gap-3 pb-12 pt-3">
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
              {trustText && (
                <div className="text-xs text-muted-foreground">{trustText}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero115 };

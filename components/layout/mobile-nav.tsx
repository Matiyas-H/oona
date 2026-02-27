import * as React from "react";
import Link from "next/link";

import { MainNavItem } from "types";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useLockBody } from "@/hooks/use-lock-body";
import { Icons } from "@/components/shared/icons";

interface MobileNavProps {
  items: MainNavItem[];
  children?: React.ReactNode;
}

export function MobileNav({ items, children }: MobileNavProps) {
  useLockBody();

  return (
    <div
      className={cn(
        "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden",
      )}
    >
      <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-urban text-xl font-bold">{siteConfig.name}</span>
        </Link>
        <nav className="grid grid-flow-row auto-rows-max text-sm">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? "#" : item.href}
              className={cn(
                "flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline",
                item.disabled && "cursor-not-allowed opacity-60",
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-2 border-t pt-4">
          <Link
            href="https://dashboard.omnia-voice.com/login"
            className="flex w-full items-center justify-center rounded-md border border-[#1a1a1a]/20 p-2 text-sm font-medium"
          >
            Login
          </Link>
          <Link
            href="https://dashboard.omnia-voice.com/register"
            className="flex w-full items-center justify-center rounded-md bg-[#1a1a1a] p-2 text-sm font-medium text-white"
          >
            Sign Up
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}

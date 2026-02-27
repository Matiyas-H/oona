import * as React from "react";
import Link from "next/link";

import { MainNavItem } from "types";
import { cn } from "@/lib/utils";
import { useLockBody } from "@/hooks/use-lock-body";

interface MobileNavProps {
  items: MainNavItem[];
  children?: React.ReactNode;
}

export function MobileNav({ items, children }: MobileNavProps) {
  useLockBody();

  return (
    <div
      className={cn(
        "fixed inset-x-0 top-16 z-50 h-[calc(100vh-4rem)] overflow-auto bg-background p-6 pb-32 shadow-md animate-in slide-in-from-top-2 md:hidden",
      )}
    >
      <div className="flex flex-col gap-4">
        <nav className="flex flex-col gap-1">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? "#" : item.href}
              className={cn(
                "flex w-full items-center rounded-md px-3 py-2 text-base font-medium hover:bg-accent",
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
            className="flex w-full items-center justify-center rounded-full border border-[#1a1a1a]/20 px-4 py-2 text-sm font-medium"
          >
            Login
          </Link>
          <Link
            href="https://dashboard.omnia-voice.com/register"
            className="flex w-full items-center justify-center rounded-full bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-white"
          >
            Sign Up
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}

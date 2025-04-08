"use client";

import Link from "next/link";
import { MainNavItem } from "@/types";
import { User } from "next-auth";

import { cn } from "@/lib/utils";
import useScroll from "@/hooks/use-scroll";
import { useSigninModal } from "@/hooks/use-signin-modal";
import { Button, buttonVariants } from "@/components/ui/button";

import { MainNav } from "./main-nav";
import { UserAccountNav } from "./user-account-nav";

interface NavBarProps {
  user: Pick<User, "name" | "image" | "email"> | undefined;
  items?: MainNavItem[];
  children?: React.ReactNode;
  rightElements?: React.ReactNode;
  scroll?: boolean;
}

export function NavBar({
  user,
  items,
  children,
  rightElements,
  scroll = false,
}: NavBarProps) {
  const scrolled = useScroll(50);
  const signInModal = useSigninModal();

  return (
    <header
      className={`sticky top-0 z-40 flex w-full justify-center bg-background/60 backdrop-blur-xl transition-all ${
        scroll ? (scrolled ? "border-b" : "bg-background/0") : "border-b"
      }`}
    >
      <div className="container flex h-16 items-center justify-between py-4">
        <MainNav items={items}>{children}</MainNav>

        <div className="flex items-center space-x-3">
          {rightElements}

          {/* {!user ? (
            <Link
              href="/login"
              className={cn(
                buttonVariants({
                  variant: "outline",
                  rounded: "full",
                }),
                "px-4",
              )}
            >
              Login Page
            </Link>
          ) : null} */}

          {user ? (
            <UserAccountNav user={user} />
          ) : (
            <>
              <Link
                href="https://dashboard.omnia-voice.com/login"
                className={cn(
                  buttonVariants({
                    variant: "outline",
                    size: "sm",
                    rounded: "full",
                  }),
                  "px-4",
                )}
              >
                Login
              </Link>
              <Link
                href="https://dashboard.omnia-voice.com/register"
                className={cn(
                  buttonVariants({
                    variant: "default",
                    size: "sm",
                    rounded: "full",
                  }),
                  "px-4",
                )}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

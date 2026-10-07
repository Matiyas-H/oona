"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { marketingConfig } from "@/config/marketing";

import { toPreview } from "./preview-links";

const LOGIN_URL = "https://dashboard.omnia-voice.com/login";
const REGISTER_URL = "https://dashboard.omnia-voice.com/register";

// Every nav item is its own bordered cell, so the header reads as the top row
// of the page grid rather than a bar floating over it. Below md the links fold
// into a menu that opens as the next rows of the same grid.
export function GridNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = marketingConfig.mainNav.map((item) => {
    const href = toPreview(item.href);
    return {
      title: item.title,
      href,
      current: pathname === href || pathname.startsWith(`${href}/`),
    };
  });

  // Close on navigation, and on Escape.
  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--ov-line)] bg-[color:var(--ov-ground-glass)] backdrop-blur">
      <nav
        aria-label="Main"
        className="mx-auto flex h-14 max-w-[1280px] border-x border-[color:var(--ov-line)]"
      >
        <Link
          href="/redesign"
          className="flex items-center gap-2.5 border-r border-[color:var(--ov-line)] px-5 font-heading text-lg"
        >
          <span aria-hidden className="grid grid-cols-2 gap-[2px]">
            <span className="size-[5px] bg-[color:var(--ov-accent)]" />
            <span className="size-[5px] bg-[color:var(--ov-brand)]" />
            <span className="size-[5px] bg-[color:var(--ov-brand)]" />
            <span className="size-[5px] bg-[color:var(--ov-accent)]" />
          </span>
          Omnia Voice
        </Link>

        <ul className="hidden md:flex">
          {links.map((link) => (
            <li key={link.title} className="flex border-r border-[color:var(--ov-line)]">
              <Link
                href={link.href}
                aria-current={link.current ? "page" : undefined}
                className={`flex items-center px-5 text-[15px] transition-colors hover:bg-[color:var(--ov-hover)] hover:text-[color:var(--ov-text)] focus-visible:bg-[color:var(--ov-line)] focus-visible:outline-none ${
                  link.current
                    ? "bg-[color:var(--ov-hover)] text-[color:var(--ov-text)] shadow-[inset_0_-2px_0_var(--ov-accent)]"
                    : "text-[color:var(--ov-text-soft)]"
                }`}
              >
                {link.title}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex">
          <Link
            href={LOGIN_URL}
            className="hidden items-center border-l border-[color:var(--ov-line)] px-5 text-[15px] text-[color:var(--ov-text-soft)] transition-colors hover:bg-[color:var(--ov-hover)] hover:text-[color:var(--ov-text)] md:flex"
          >
            Log in
          </Link>
          <Link
            href={REGISTER_URL}
            className="flex items-center bg-[color:var(--ov-brand)] px-5 text-[15px] font-medium text-[color:var(--ov-on-brand)] transition-colors hover:bg-[color:var(--ov-brand-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[color:var(--ov-accent)]"
          >
            Start building
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="ov-mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="grid w-14 place-items-center border-l border-[color:var(--ov-line)] transition-colors hover:bg-[color:var(--ov-hover)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[color:var(--ov-accent)] md:hidden"
          >
            {/* Three bars that fold into a cross. */}
            <span aria-hidden className="relative block h-3 w-5">
              <span
                className={`absolute left-0 top-0 h-[2px] w-5 bg-[color:var(--ov-text)] transition-transform ${
                  menuOpen ? "translate-y-[5px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[5px] h-[2px] w-5 bg-[color:var(--ov-text)] transition-opacity ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[10px] h-[2px] w-5 bg-[color:var(--ov-text)] transition-transform ${
                  menuOpen ? "-translate-y-[5px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      <div
        id="ov-mobile-menu"
        hidden={!menuOpen}
        className="border-t border-[color:var(--ov-line)] bg-[color:var(--ov-ground)] md:hidden"
      >
        <ul className="divide-y divide-[color:var(--ov-line)] border-x border-[color:var(--ov-line)]">
          {[...links, { title: "Log in", href: LOGIN_URL, current: false }].map((link) => (
            <li key={link.title}>
              <Link
                href={link.href}
                aria-current={link.current ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between px-5 py-4 text-lg transition-colors hover:bg-[color:var(--ov-hover)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[color:var(--ov-accent)] ${
                  link.current ? "text-[color:var(--ov-text)]" : "text-[color:var(--ov-text-soft)]"
                }`}
              >
                {link.title}
                {link.current && <span aria-hidden className="size-2 bg-[color:var(--ov-accent)]" />}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}

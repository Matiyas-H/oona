"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { currentFor } from "./preview-links";

// Above the nav on every preview page: says what this is, and leads back to
// the live version of the same page.
export function PreviewStrip() {
  const pathname = usePathname();

  return (
    <p className="border-b border-[color:var(--ov-line)] px-5 py-2.5 text-center text-[13px] text-[color:var(--ov-muted)]">
      You&apos;re previewing our new design. It&apos;s still in progress.{" "}
      <Link
        href={currentFor(pathname)}
        className="text-[color:var(--ov-accent)] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--ov-accent)]"
      >
        Back to the current site
      </Link>
    </p>
  );
}

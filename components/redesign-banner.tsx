"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { trackFunnel } from "@/lib/track";
import { previewFor } from "@/components/redesign/preview-links";

const DISMISSED_KEY = "ov-redesign-banner-dismissed";

/**
 * The strip above the live site's nav that invites visitors into the redesign
 * preview, opening the redesigned version of the page they are on where one
 * exists. Dismissal is remembered per browser; it is a convenience, so if
 * storage is unavailable the banner simply shows again.
 */
export function RedesignBanner() {
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(DISMISSED_KEY) === "1");
    } catch {}
  }, []);

  if (dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISSED_KEY, "1");
    } catch {}
  };

  return (
    <div className="relative bg-[#121411] px-12 py-2.5 text-center text-[13px] text-[#EEF0EA]/80">
      We&apos;re redesigning omnia-voice.com.{" "}
      <Link
        href={previewFor(pathname)}
        onClick={() => trackFunnel("redesign_preview_opened", { from: pathname })}
        className="font-medium text-[#C4E8A8] underline underline-offset-4 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4E8A8]"
      >
        Try the new design
      </Link>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center text-base leading-none text-[#EEF0EA]/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4E8A8]"
      >
        ×
      </button>
    </div>
  );
}

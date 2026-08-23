"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { consentRequired, readConsent, setConsent } from "@/lib/consent";
import { deleteAttribution, flushPendingAttribution } from "@/lib/attribution";

/**
 * Consent for ov_attr, the single non-essential cookie this site sets.
 *
 * Both answers are one click, the same size, side by side. The pattern
 * regulators actually pursue is not the banner itself but the asymmetric one —
 * a solid Accept next to a greyed-out text link — so Decline is a real button
 * and sits first, in reading order.
 *
 * Nothing renders until after mount. The server has no idea what this visitor
 * chose, so rendering the banner during SSR would either flash it at people who
 * already answered or mismatch hydration.
 *
 * Shape is deliberate. A full-width bar across the bottom sat directly on top of
 * the Luna voice control (fixed bottom-6 right-6, same z-index, and this mounts
 * later so it won). Covering the demo button with a consent notice would trade
 * the best thing on the page for the most boring one. A bottom-LEFT card leaves
 * that corner alone without either component knowing about the other; on narrow
 * screens it lifts above the button instead of beside it.
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Ask only where consent is required, and only if unanswered. Outside the
    // EEA/UK/CH there is no opt-in rule for this cookie, so a banner there would
    // cost attribution on paid traffic and buy nothing. /cookies still lets
    // anyone turn it off.
    if (consentRequired() && !readConsent()) setVisible(true);
  }, []);

  if (!visible) return null;

  const decide = (granted: boolean) => {
    setConsent(granted ? "granted" : "denied");
    if (granted) {
      // Commit what the landing URL said, which may be several pages ago.
      flushPendingAttribution();
    } else {
      deleteAttribution();
    }
    setVisible(false);
  };

  return (
    <section
      aria-label="Cookie consent"
      className="fixed bottom-20 left-4 right-4 z-50 rounded-lg border bg-background/95 p-4 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/85 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md"
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          We use one cookie to see which campaigns bring people here. It is our
          own — no third-party trackers, no advertising networks, and nothing
          sold on. Sign-in and security cookies are always on.{" "}
          <Link href="/cookies" className="underline underline-offset-4 hover:text-foreground">
            What we store
          </Link>
        </p>

        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={() => decide(false)} className="flex-1">
            Decline
          </Button>
          <Button size="sm" onClick={() => decide(true)} className="flex-1">
            Accept
          </Button>
        </div>
      </div>
    </section>
  );
}

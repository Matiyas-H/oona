"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ConsentState, readConsent, setConsent } from "@/lib/consent";
import { deleteAttribution, flushPendingAttribution } from "@/lib/attribution";

/**
 * Live consent control, embedded in the cookie policy.
 *
 * GDPR Article 7(3): withdrawing consent must be as easy as giving it. A banner
 * that can only ever say yes, with the only route back being "clear your
 * browser cookies", does not meet that — so the current answer is shown here
 * and either answer can be changed on the spot.
 */
export function CookieSettings() {
  const [state, setState] = useState<ConsentState | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setState(readConsent());
    setMounted(true);
  }, []);

  // The server cannot know this visitor's answer, so render nothing until the
  // client has read the cookie.
  if (!mounted) return null;

  const choose = (granted: boolean) => {
    setConsent(granted ? "granted" : "denied");
    if (granted) flushPendingAttribution();
    else deleteAttribution();
    setState(granted ? "granted" : "denied");
  };

  const label =
    state === "granted"
      ? "Analytics cookie: on. We can see which campaign brought you here."
      : state === "denied"
        ? "Analytics cookie: off. Nothing but sign-in and security cookies are stored."
        : "You have not answered yet, so nothing beyond sign-in and security cookies is stored.";

  return (
    <div className="not-prose my-6 rounded-lg border p-5">
      <p className="text-sm font-medium">Your current setting</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      <div className="mt-4 flex gap-3">
        <Button
          variant={state === "denied" ? "default" : "outline"}
          size="sm"
          onClick={() => choose(false)}
          disabled={state === "denied"}
        >
          Turn off
        </Button>
        <Button
          variant={state === "granted" ? "default" : "outline"}
          size="sm"
          onClick={() => choose(true)}
          disabled={state === "granted"}
        >
          Turn on
        </Button>
      </div>
    </div>
  );
}

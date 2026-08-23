"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/**
 * Mounted once in the marketing layout. Runs on first paint, records first-touch
 * attribution into a cookie shared with dashboard.omnia-voice.com, and does
 * nothing on every subsequent visit.
 */
export function AttributionCapture() {
  useEffect(() => {
    try {
      captureAttribution();
    } catch {
      // Attribution is never worth breaking a page over.
    }
  }, []);

  return null;
}

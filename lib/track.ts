import { track } from "@vercel/analytics";

/**
 * The homepage funnel, in the order a visitor moves through it.
 *
 * The point of these four events is to answer one question the hero change was
 * aimed at: does a visitor actually reach the demo, and do they start it?
 * Pageviews and bounce rate cannot answer that, and both of the customers we
 * have on record converted by trying the product rather than by reading about
 * it.
 *
 * `playground_reached` fires on intersection, so it measures *arrival*, not
 * intent. The ratio that matters is reached -> started.
 */
export type FunnelEvent =
  | "playground_reached"
  | "playground_started"
  | "voice_guide_opened"
  | "voice_guide_started";

export function trackFunnel(
  event: FunnelEvent,
  props?: Record<string, string | number | boolean | null>,
) {
  try {
    track(event, props);
  } catch {
    // Analytics must never break the page. A blocked script, an ad blocker, or
    // a plan without custom events are all normal and none of them are worth an
    // exception in front of a visitor.
  }
}

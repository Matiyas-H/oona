/**
 * First-touch attribution, stored in a first-party cookie.
 *
 * www.omnia-voice.com and dashboard.omnia-voice.com share a registrable parent
 * domain, so a cookie scoped to `.omnia-voice.com` is sent to both. That means
 * no cross-domain linker, no link decoration, and no third-party script — the
 * dashboard simply reads the cookie at signup and writes it onto the user.
 *
 * FIRST touch, not last: we only write when the cookie is empty. Someone who
 * arrives from an ad, leaves, and comes back via a Google search two days later
 * was won by the ad, and last-touch would hand the credit to organic search.
 *
 * Nothing here is a third-party tracker. It is our own domain, our own database,
 * and it is what lets us answer "which campaign produced a paying customer"
 * without a vendor in the middle — which matters rather a lot for a company
 * that sells EU data residency.
 */

export const ATTRIBUTION_COOKIE = "ov_attr";
const MAX_AGE_DAYS = 90;

export interface Attribution {
  gclid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  landing_page?: string;
  referrer?: string;
  first_seen?: string;
}

const PARAMS = [
  "gclid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

/** Cap each value so a crafted URL cannot bloat the cookie. */
const clamp = (v: string, n = 200) => v.slice(0, n);

export function readAttribution(): Attribution | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${ATTRIBUTION_COOKIE}=`))
    ?.split("=")
    .slice(1)
    .join("=");
  if (!raw) return null;
  try {
    return JSON.parse(decodeURIComponent(raw)) as Attribution;
  } catch {
    return null;
  }
}

/**
 * Cookie domain. In production both hosts sit under omnia-voice.com, so the
 * parent domain is what makes this work at all. On localhost or a preview
 * deployment we deliberately omit Domain — a bare host cookie is correct there,
 * and setting a domain that does not match silently drops the cookie.
 */
function cookieDomain(host: string): string | null {
  return host.endsWith("omnia-voice.com") ? ".omnia-voice.com" : null;
}

export function captureAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;

  // First touch wins.
  if (readAttribution()) return null;

  const url = new URL(window.location.href);
  const data: Attribution = {};

  for (const key of PARAMS) {
    const v = url.searchParams.get(key);
    if (v) data[key] = clamp(v);
  }

  const ref = document.referrer;
  const external =
    ref && (() => { try { return new URL(ref).hostname !== window.location.hostname; } catch { return false; } })();

  // Nothing paid and nothing external to record — a direct visit is not worth a
  // cookie, and writing one would block a genuine first touch later.
  if (Object.keys(data).length === 0 && !external) return null;

  if (external) data.referrer = clamp(ref, 300);
  data.landing_page = clamp(url.pathname, 300);
  data.first_seen = new Date().toISOString();

  const parts = [
    `${ATTRIBUTION_COOKIE}=${encodeURIComponent(JSON.stringify(data))}`,
    "Path=/",
    `Max-Age=${MAX_AGE_DAYS * 24 * 60 * 60}`,
    "SameSite=Lax",
  ];
  const domain = cookieDomain(window.location.hostname);
  if (domain) parts.push(`Domain=${domain}`, "Secure");

  document.cookie = parts.join("; ");
  return data;
}

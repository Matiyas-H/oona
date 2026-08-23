/**
 * Cookie consent, for the one non-essential cookie this site sets.
 *
 * WHY THIS EXISTS: ePrivacy Article 5(3) requires consent before storing
 * anything on a visitor's device unless it is strictly necessary for a service
 * they explicitly requested. That test turns on PURPOSE, not on who owns the
 * domain — "it is our own first-party cookie, not a third-party tracker" is a
 * good privacy story but it is not an exemption. ov_attr exists to measure
 * which campaign produced a customer, which is not strictly necessary, so it
 * waits for a yes.
 *
 * What does NOT wait:
 *   - authjs.* session/CSRF cookies — security for a service the user asked
 *     for, exempt on any reading.
 *   - ov_consent itself — a cookie whose only job is to remember "this person
 *     said no" is necessary to honour the refusal. Asking consent to store the
 *     refusal would be circular.
 *
 * Retention differs by answer on purpose. A yes is remembered for a year. A no
 * is remembered for six months and then we may ask once more — long enough not
 * to nag, short enough that a refusal is not treated as permanent silence.
 */

export const CONSENT_COOKIE = "ov_consent";

export type ConsentState = "granted" | "denied";

const DAYS_GRANTED = 365;
const DAYS_DENIED = 180;

export function readConsent(): ConsentState | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${CONSENT_COOKIE}=`))
    ?.split("=")[1];
  return raw === "granted" || raw === "denied" ? raw : null;
}

/**
 * Same domain rule as the attribution cookie: on production both hosts sit
 * under omnia-voice.com, so a parent-domain cookie means a choice made on the
 * marketing site is honoured on the dashboard too. Locally we omit Domain,
 * because setting one that does not match silently drops the cookie.
 */
function cookieDomain(host: string): string | null {
  return host.endsWith("omnia-voice.com") ? ".omnia-voice.com" : null;
}

function writeCookie(name: string, value: string, maxAgeSeconds: number) {
  const parts = [
    `${name}=${value}`,
    "Path=/",
    `Max-Age=${maxAgeSeconds}`,
    "SameSite=Lax",
  ];
  const domain = cookieDomain(window.location.hostname);
  if (domain) parts.push(`Domain=${domain}`, "Secure");
  document.cookie = parts.join("; ");
}

export function setConsent(state: ConsentState): void {
  if (typeof window === "undefined") return;
  const days = state === "granted" ? DAYS_GRANTED : DAYS_DENIED;
  writeCookie(CONSENT_COOKIE, state, days * 24 * 60 * 60);
}

/**
 * Withdrawing must be as easy as giving — GDPR Article 7(3). Clearing the
 * record brings the banner back, so /cookies can offer a real "change your
 * mind" rather than a dead end.
 */
export function clearConsent(): void {
  if (typeof window === "undefined") return;
  writeCookie(CONSENT_COOKIE, "", 0);
}

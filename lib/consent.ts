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
 * WHERE it is asked is decided in middleware, which reads the visitor's country
 * and writes ov_region. Consent is an EEA/UK/Swiss requirement; the rest of the
 * world has no equivalent opt-in rule for a first-party cookie used only for our
 * own measurement, so asking there costs attribution and buys nothing. An
 * unknown region resolves to "ask" — see middleware.ts for why the uncertain
 * case always takes the expensive side.
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

export const REGION_COOKIE = "ov_region";

/**
 * Does this visitor have to be asked? Anything other than an explicit "row"
 * means yes, so a missing cookie — middleware skipped, cookie cleared, someone
 * poking at devtools — lands on asking rather than on storing.
 */
export function consentRequired(): boolean {
  if (typeof document === "undefined") return true;
  const raw = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${REGION_COOKIE}=`))
    ?.split("=")[1];
  return raw !== "row";
}

/**
 * What actually governs storage, combining the explicit answer with the
 * regional default.
 *
 * An explicit choice always wins, in both directions: someone outside the EEA
 * who turns the cookie off on /cookies stays off. Silence means no in a region
 * that requires asking, and yes in one that does not.
 */
export function effectiveConsent(): ConsentState {
  const explicit = readConsent();
  if (explicit) return explicit;
  return consentRequired() ? "denied" : "granted";
}

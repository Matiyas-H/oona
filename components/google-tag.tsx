import Script from "next/script";

import { CONSENT_COOKIE, REGION_COOKIE } from "@/lib/consent";

/**
 * The Google tag, wired to Consent Mode v2.
 *
 * WHY CONSENT MODE AT ALL: since March 2024 Google requires it for advertisers
 * sending EEA traffic through a Google tag. Without it, conversion measurement
 * and remarketing degrade or stop. That is an ad-account problem rather than a
 * legal one, but it lands on the same day we start spending.
 *
 * ORDER IS THE WHOLE TRICK. Google's guidance is blunt: if the consent default
 * runs after the tag, the default silently does not apply.
 *
 * The first version of this used next/script with strategy="afterInteractive"
 * for the defaults, and that is wrong in a way that does not show up in review.
 * Inline afterInteractive scripts are injected by the client runtime after
 * hydration, so they were not in the server HTML at all, while gtag.js was
 * already being preloaded. The defaults would have been racing the tag.
 *
 * So the defaults are a plain inline script rendered into the SSR HTML, which
 * executes during parse, before any deferred script runs. gtag.js stays on
 * next/script — it is async and reads dataLayer when it initialises, by which
 * point the defaults are already sitting there.
 *
 * DEFAULTS ARE DERIVED FROM OUR OWN COOKIES, not from Google's `region`
 * parameter, so there is one source of truth for consent on this site. The
 * banner, the /cookies control and the ad tag cannot disagree. The inline
 * script reads document.cookie synchronously, which is why this works before
 * React has hydrated anything.
 *
 * RENDERS NOTHING WITHOUT AN ID. No env var, no tag, no network request — so
 * this is inert until someone deliberately sets NEXT_PUBLIC_GOOGLE_ADS_ID.
 */
export function GoogleTag() {
  const id = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  if (!id) return null;

  // Mirrors effectiveConsent() in lib/consent.ts, inlined because it has to run
  // before hydration. Keep the two in step.
  const consentDefaults = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = window.gtag || gtag;

    var read = function (name) {
      var m = document.cookie.split("; ").find(function (c) {
        return c.indexOf(name + "=") === 0;
      });
      return m ? m.split("=").slice(1).join("=") : null;
    };

    var explicit = read(${JSON.stringify(CONSENT_COOKIE)});
    var region = read(${JSON.stringify(REGION_COOKIE)});
    // Explicit answer wins. Otherwise silence means no wherever we must ask,
    // and yes where no opt-in rule applies. Anything unrecognised means ask.
    var granted =
      explicit === "granted" ? true
      : explicit === "denied" ? false
      : region === "row";

    var value = granted ? "granted" : "denied";
    gtag("consent", "default", {
      ad_storage: value,
      ad_user_data: value,
      ad_personalization: value,
      analytics_storage: value,
      functionality_storage: "granted",
      security_storage: "granted",
      wait_for_update: 500
    });
  `;

  return (
    <>
      {/* Deliberately a raw script, not next/script — see the note above. */}
      <script
        id="google-consent-default"
        dangerouslySetInnerHTML={{ __html: consentDefaults }}
      />
      <Script
        id="google-tag"
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="google-tag-init" strategy="afterInteractive">
        {`gtag('js', new Date()); gtag('config', ${JSON.stringify(id)});`}
      </Script>
    </>
  );
}

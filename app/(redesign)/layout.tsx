import type { Metadata } from "next";

import { AttributionCapture } from "@/components/attribution-capture";
import { CookieBanner } from "@/components/cookie-banner";
import { GoogleTag } from "@/components/google-tag";
import { GridNav } from "@/components/redesign/grid-nav";
import { lunaSectionPages } from "@/components/redesign/preview-links";
import { PreviewStrip } from "@/components/redesign/preview-strip";
import { themeCss } from "@/components/redesign/theme";
import { WordmarkFooter } from "@/components/redesign/wordmark-footer";
import { LandingVoiceControl } from "@/components/voice/landing-voice-control";

// Preview of the redesigned site, served under /redesign. Kept out of search
// so it never competes with the live pages it duplicates.
export const metadata: Metadata = {
  title: "Omnia Voice — new design preview",
  robots: { index: false, follow: false },
};

// Nav, footer and Luna live here rather than on each page: a layout stays
// mounted across navigation, so a Luna session survives moving between pages.
// Attribution and the Google tag match the live marketing layout, so a visitor
// who opens the preview is measured exactly as on the current site.
export default function RedesignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="ov-root min-h-screen bg-[color:var(--ov-ground)] text-[color:var(--ov-text)] antialiased"
      style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
    >
      {/* Raw CSS: as a text child React would escape quotes differently on
          server and client and fail hydration. Section jumps (anchors, and
          Luna's scrollIntoView) clear the sticky nav. */}
      <style
        dangerouslySetInnerHTML={{
          __html: "html { scroll-padding-top: 56px; }" + themeCss,
        }}
      />
      <AttributionCapture />

      <PreviewStrip />

      <GridNav />
      <main>{children}</main>
      <WordmarkFooter />
      <LandingVoiceControl sectionPages={lunaSectionPages} />
      {/* The banner is a light card that inherits text colour; keep it dark. */}
      <div className="text-[#1a1a1a]">
        <CookieBanner />
      </div>
      <GoogleTag />
    </div>
  );
}

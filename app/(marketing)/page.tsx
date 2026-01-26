// New redesigned components
import { HeroNew } from "@/components/sections/hero-new";
import { Playground } from "@/components/sections/playground";
import { IntroNew } from "@/components/sections/intro-new";
import { Capabilities } from "@/components/sections/capabilities";
import { CodeSection } from "@/components/sections/code-section";
import { DeploymentOptions } from "@/components/sections/deployment-options";
import { TrustSection } from "@/components/sections/trust-section";
import { PricingSection } from "@/components/sections/pricing-section";
import { FAQNew } from "@/components/sections/faq-new";
import { CTASection } from "@/components/sections/cta-section";

export default async function IndexPage() {
  return (
    <>
      <HeroNew />
      <Playground />
      <IntroNew />
      <Capabilities />
      <CodeSection />
      <DeploymentOptions />
      <TrustSection />
      <PricingSection />
      <FAQNew />
      <CTASection />
    </>
  );
}

import { infos } from "@/config/landing";
import { BentoGrid } from "@/components/sections/bentogrid";
import { Features } from "@/components/sections/features";
import { HeroLanding } from "@/components/sections/hero-landing";
import { InfoLanding } from "@/components/sections/info-landing";
import Intro from "@/components/sections/intro";
import { MissedCallsSection } from "@/components/sections/missed-calls-section";
import { Powered } from "@/components/sections/powered";
import PreviewLanding from "@/components/sections/preview-landing";
import { Testimonials } from "@/components/sections/testimonials";
import NewFeatures from "@/components/sections/new-features";

export default async function IndexPage() {
  return (
    <>
      <HeroLanding />
      <PreviewLanding />
      <Intro />
       <NewFeatures />
      <Powered />
      <BentoGrid />
      <InfoLanding data={infos[0]} reverse={true} />
      {/* <MissedCallsSection /> */}
      {/* <InfoLanding data={infos[1]} /> */}
      <Features />
      <Testimonials />
    </>
  );
}

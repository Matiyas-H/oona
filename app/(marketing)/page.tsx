import { infos } from "@/config/landing";
import { BentoGrid } from "@/components/sections/bentogrid";
import { Codeexample1 } from "@/components/sections/codeexample1";
import { Features } from "@/components/sections/features";
import { Feature13 } from "@/components/sections/feature13";
import { Feature43 } from "@/components/sections/feature43";
import { Feature51 } from "@/components/sections/feature51";
import { Feature72 } from "@/components/sections/feature72";
import { Hero115 } from "@/components/sections/hero115";
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
      <Hero115 />
      <PreviewLanding />
      <Intro />
       <NewFeatures />
      {/* <Powered /> */}
      {/* <BentoGrid /> */}
      {/* <InfoLanding data={infos[0]} reverse={true} /> */}
      {/* <Feature72 /> */}
      <Feature51 />
      <Feature13 />
      <Codeexample1 />
      <Feature43 />
      {/* <MissedCallsSection /> */}
      {/* <InfoLanding data={infos[1]} /> */}
      {/* <Features /> */}
      <Testimonials />
    </>
  );
}

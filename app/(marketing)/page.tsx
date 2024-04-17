import { BentoGrid } from "@/public/images/blog/components/sections/bentogrid";
import { Features } from "@/public/images/blog/components/sections/features";
import { HeroLanding } from "@/public/images/blog/components/sections/hero-landing";
import { InfoLanding } from "@/public/images/blog/components/sections/info-landing";
import { Powered } from "@/public/images/blog/components/sections/powered";
import { PreviewLanding } from "@/public/images/blog/components/sections/preview-landing";
import { Testimonials } from "@/public/images/blog/components/sections/testimonials";

import { infos } from "@/config/landing";

export default async function IndexPage() {
  return (
    <>
      <HeroLanding />
      <PreviewLanding />
      <Powered />
      <BentoGrid />
      <InfoLanding data={infos[0]} reverse={true} />
      {/* <InfoLanding data={infos[1]} /> */}
      <Features />
      <Testimonials />
    </>
  );
}

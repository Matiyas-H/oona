import { default as omniaDash } from "@/public/images/omnia-dash.png";
import { default as darkPreview } from "@/public/images/search-mockup-dark.png";

import BlurImage from "@/components/shared/blur-image";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default function PreviewLanding() {
  return (
    <div className="mt-8 pb-6 sm:mt-12 sm:pb-20">
      <MaxWidthWrapper>
        <div className="relative h-auto w-full">
          <div className="relative w-full overflow-hidden rounded-t-2xl shadow-2xl">
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-background/80 to-background blur-2xl" />
            <BlurImage
              src={omniaDash}
              alt="light preview landing"
              className="flex size-full object-contain object-center dark:hidden"
              width={1800}
              height={900}
              priority
              placeholder="blur"
            />
            {/* <BlurImage
              src={darkPreview}
              alt="dark preview landing"
              className="hidden size-full object-contain object-center dark:flex"
              width={1800}
              height={900}
              priority
              placeholder="blur"
            /> */}
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}

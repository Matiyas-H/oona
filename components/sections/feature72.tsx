import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Feature {
  id: string;
  heading: string;
  description: string;
  image: string;
  url: string;
}

interface Feature72Props {
  title: string;
  description?: string;
  buttonUrl?: string;
  buttonText?: string;
  features?: Feature[];
}

const Feature72 = ({
  title = "Voice AI infrastructure built to scale",
  description = "Run production voice agents with predictable latency and transparent control, whether you deploy on Omnia Voice or your own cloud.",
  buttonUrl = "https://dashboard.omnia-voice.com/login",
  buttonText = "Get Started",
  features = [
    {
      id: "feature-1",
      heading: "Real-Time Processing",
      description:
        "Audio-native pipeline keeps full turn-taking below 250ms so conversations feel natural, not scripted.",
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
      url: "https://dashboard.omnia-voice.com/login",
    },
    {
      id: "feature-2",
      heading: "Enterprise Security",
      description:
        "Encryption, audit logging, and private networking options let you meet stringent internal and external requirements.",
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-2.svg",
      url: "https://dashboard.omnia-voice.com/login",
    },
    {
      id: "feature-3",
      heading: "No Vendor Lock-in",
      description:
        "Bring your preferred STT, LLM, and TTS providers — or swap them — without rewriting your orchestration.",
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-3.svg",
      url: "https://dashboard.omnia-voice.com/login",
    },
    {
      id: "feature-4",
      heading: "Global Scale",
      description:
        "Scale across regions with autoscaling and resilience features tuned for live voice workloads.",
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-4.svg",
      url: "https://dashboard.omnia-voice.com/login",
    },
  ],
}: Feature72Props) => {
  return (
    <section className="py-32">
      <div className="container max-w-6xl">
        <div className="mb-8 lg:max-w-sm">
          <h2 className="mb-3 text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6">
            {title}
          </h2>
          {description && (
            <p className="mb-8 text-muted-foreground lg:text-lg">
              {description}
            </p>
          )}
          {buttonUrl && (
            <Button variant="link" asChild>
              <a
                href={buttonUrl}
                className="group flex items-center font-medium md:text-base lg:text-lg"
              >
                {buttonText}
                <ArrowRight />
              </a>
            </Button>
          )}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="flex flex-col text-clip rounded-xl border border-border"
            >
              <a href={feature.url}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={feature.image}
                  alt={feature.heading}
                  className="aspect-16/9 size-full object-cover object-center transition-opacity hover:opacity-80"
                />
              </a>
              <div className="px-6 py-8 md:px-8 md:py-10 lg:px-10 lg:py-12">
                <h3 className="mb-3 text-lg font-semibold md:mb-4 md:text-2xl lg:mb-6">
                  {feature.heading}
                </h3>
                <p className="text-muted-foreground lg:text-lg">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Feature72 };

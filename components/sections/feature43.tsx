import {
  Activity,
  Cpu,
  GitBranchPlus,
  Languages,
  ShieldCheck,
  Waves,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface Feature {
  heading: string;
  description: string;
  icon: React.ReactNode;
}

interface Feature43Props {
  title?: string;
  features?: Feature[];
  buttonText?: string;
  buttonUrl?: string;
}

const Feature43 = ({
  title = "Why teams choose Omnia Voice",
  features = [
    {
      heading: "Audio-First Architecture",
      description:
        "Raw audio flows straight into the LLM’s embedding space—no stand-alone ASR to tune, no lossy conversions, just a single loop that keeps paralinguistics intact.",
      icon: <Waves className="size-6" />,
    },
    {
      heading: "Turn-Taking Intelligence",
      description:
        "Fine-tuned encoders detect pauses, interruptions, and intent in real time. Combined with a projected multimodal space, responses land in ~250 ms first-token latency.",
      icon: <Activity className="size-6" />,
    },
    {
      heading: "Unified Control Plane",
      description:
        "Hosted today, self-managed tomorrow—the APIs, observability, and tooling stay identical whether you run on Omnia Cloud, a dedicated cluster, or your own GPUs.",
      icon: <GitBranchPlus className="size-6" />,
    },
    {
      heading: "Multilingual by Design",
      description:
        "A single model handles language switching and accent shifts mid-conversation without bolting on third-party STT/TTs pairs—every voice stays consistent.",
      icon: <Languages className="size-6" />,
    },
    {
      heading: "Programmable Routing",
      description:
        "WebRTC, SIP, Twilio, or Telnyx ingress coupled with native tools and webhooks—automate workflows from the same pipeline without brittle middleware.",
      icon: <Cpu className="size-6" />,
    },
    {
      heading: "Enterprise Safeguards",
      description:
        "End-to-end encryption, retention controls, and audit trails on hosted. Self-managed deployments keep audio and metadata inside your perimeter with our support.",
      icon: <ShieldCheck className="size-6" />,
    },
  ],
  buttonText = "Start Building",
  buttonUrl = "https://dashboard.omnia-voice.com/login",
}: Feature43Props) => {
  return (
    <section className="py-32">
      <div className="container max-w-6xl">
        {title && (
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="text-pretty text-4xl font-medium lg:text-5xl">
              {title}
            </h2>
          </div>
        )}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div key={i} className="flex flex-col">
              <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-accent">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold">{feature.heading}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
        {buttonUrl && (
          <div className="mt-16 flex justify-center">
            <Button size="lg" asChild>
              <a href={buttonUrl}>{buttonText}</a>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export { Feature43 };

import { InfoLdg } from "types";

export const infos: InfoLdg[] = [
  {
    title: "The Owned Stack for Real-Time Voice AI",
    description:
      "Traditional voice AI chains three vendors together — STT, LLM, and TTS — creating 500-1000ms latency and permanent vendor lock-in. We built a unified audio-native architecture that owns the entire stack.",
    image: "/images/work-from-home.jpg",
    list: [
      {
        title: "Break Free from API Chains",
        description: "No more STT→LLM→TTS cascades. Audio connects directly to our LLM through a lightweight projection layer.",
        icon: "laptop",
      },
      {
        title: "Own Your Infrastructure",
        description: "Deploy on-premise, cloud, or white-label. Bring your own models and control costs at scale.",
        icon: "settings",
      },
      {
        title: "Sub-250ms Responses",
        description:
          "Keep total turn-taking below 250ms so conversations stay responsive without stitching together third-party APIs.",
        icon: "search",
      },
    ],
  },
  {
    title: "Integrate with your existing stack",
    description:
      "Connect Omnia Voice to your CRMs, data warehouses, and communication channels with straightforward APIs and webhooks.",
    image: "/images/work-from-home.jpg",
    list: [
      {
        title: "Flexible",
        description:
          "Deploy on Omnia Voice, your own cloud, or on-premise with the same orchestration layer.",
        icon: "laptop",
      },
      {
        title: "Efficient",
        description: "Automate manual steps with event streams, webhooks, and integration templates.",
        icon: "check",
      },
      {
        title: "Reliable",
        description:
          "Observability, alerts, and access controls give your team confidence to run voice agents in production.",
        icon: "settings",
      },
    ],
  },
];

export const features = [
  {
    title: "Sub-250ms Latency",
    description:
      "Up to 5× faster than traditional voice AI. Our audio-native architecture eliminates the cascade bottleneck of chained STT→LLM→TTS systems.",
    link: "/",
  },
  {
    title: "Audio-Native LLMs",
    description:
      "Audio connects directly to the LLM through our lightweight multimodal projection layer — no external STT or orchestration APIs required.",
    link: "/",
  },
  {
    title: "Owned Stack Economics",
    description:
      "Break free from permanent vendor margins. Own your infrastructure costs and scale without being locked to external API pricing.",
    link: "/",
  },
  {
    title: "Native Multilingual Support",
    description:
      "Built-in multilingual capabilities without requiring separate language models or translation layers.",
    link: "/",
  },
  {
    title: "Deployment Flexibility",
    description:
      "Cloud, self-hosted, or white-label deployments. Bring your own models and maintain compliance with regulated industry requirements.",
  },
  {
    title: "Production-Ready Infrastructure",
    description:
      "Live API, SDK, and no-code workspace. Deploy secure voice agents in minutes with GPU-optimized TTS and real-time streaming.",
    link: "/",
  },
];

export const testimonials = [
  {
    name: "Ola Martin",
    job: "CTO, Nordic Support Desk",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    review:
      "We moved from prototype to production voice agents in weeks while keeping the entire stack inside our cloud.",
  },
  {
    name: "Varia Chen",
    job: "Head of Product, RelayOps",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    review:
      "Omnia Voice let us plug in our existing data sources and speech models without rebuilding our call workflows.",
  },
  {
    name: "Elton Kullstrom",
    job: "Partner, Antler Oy",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    review:
      "The responsiveness and control we get from Omnia Voice is on another level compared with chained API solutions.",
  },
];

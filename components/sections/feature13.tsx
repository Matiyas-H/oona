import Link from "next/link";

interface Feature {
  id: string;
  heading: string;
  label: string;
  description: string;
  url?: string;
}

interface Feature13Props {
  title?: string;
  features?: Feature[];
}

const Feature13 = ({
  title = "Infrastructure enterprises rely on",
  features = [
    {
      id: "feature-1",
      heading: "Enterprise Governance & Compliance",
      label: "ENTERPRISE CONTROLS",
      description:
        "Encryption, retention policies, and audit trails come standard. Self-manage to keep every packet inside your environment when regulations require it.",
      url: "/contact",
    },
    {
      id: "feature-2",
      heading: "Deep Observability & Alerting",
      label: "REAL-TIME TELEMETRY",
      description:
        "Per-call traces, latency breakdowns, and actionable alerts keep your team ahead of issues whether you stay hosted or run the stack yourself.",
      url: "/contact",
    },
    {
      id: "feature-3",
      heading: "Dedicated GPU Capacity",
      label: "PERFORMANCE & SCALE",
      description:
        "Reserve throughput on Omnia’s infrastructure or deploy the stack on your own GPU fleet. Either way you stay in control of performance envelopes.",
      url: "/contact",
    },
    {
      id: "feature-4",
      heading: "Migration & Partnership Support",
      label: "ENTERPRISE SUCCESS",
      description:
        "Work directly with Omnia engineering—from early proof-of-concept through self-managed rollouts. We share battle-tested runbooks and handle updates.",
      url: "/contact",
    },
  ],
}: Feature13Props) => {
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
        <div className="grid gap-8 lg:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="flex flex-col justify-between rounded-lg border bg-muted"
            >
              <div className="flex flex-col gap-6 p-6 md:p-8">
                <span className="font-mono text-xs text-muted-foreground">
                  {feature.label}
                </span>
                {feature.url ? (
                  <Link href={feature.url}>
                    <h3 className="text-2xl transition-all hover:text-primary hover:opacity-80 sm:text-3xl lg:text-4xl">
                      {feature.heading}
                    </h3>
                  </Link>
                ) : (
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl">
                    {feature.heading}
                  </h3>
                )}
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Feature13 };

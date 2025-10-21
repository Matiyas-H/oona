import { Cloud, ServerCog, ShieldCheck } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Feature {
  id: string;
  icon: React.ReactNode;
  heading: string;
  description: string;
  image: string;
  url: string;
  isDefault: boolean;
}

interface Feature51Props {
  features?: Feature[];
}

const Feature51 = ({
  features = [
    {
      id: "feature-1",
      heading: "Hosted Platform",
      icon: <Cloud className="size-4" />,
      description:
        "Use Omnia’s hosted dashboard and APIs to launch real-time voice instantly—GPU-tuned, monitored, and updated by our team.",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
      url: "https://dashboard.omnia-voice.com/login",
      isDefault: true,
    },
    {
      id: "feature-2",
      icon: <ServerCog className="size-4" />,
      heading: "Managed API",
      description:
        "Need dedicated capacity? Run on an Omnia-managed GPU cluster with private endpoints and routing tailored to your workload.",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-2.svg",
      url: "https://dashboard.omnia-voice.com/login",
      isDefault: false,
    },
    {
      id: "feature-3",
      icon: <ShieldCheck className="size-4" />,
      heading: "Self-Managed",
      description:
        "Run the Omnia stack on your own GPU footprint—your cloud or on-prem—with enterprise licensing, updates, and support from our team.",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-3.svg",
      url: "https://dashboard.omnia-voice.com/login",
      isDefault: false,
    },
  ],
}: Feature51Props) => {
  const defaultTab =
    features.find((tab) => tab.isDefault)?.id || features[0].id;

  return (
    <section className="py-32">
      <div className="container max-w-6xl">
        <Tabs defaultValue={defaultTab} className="p-0">
          <TabsList className="flex h-auto w-full flex-col gap-2 bg-background p-0 md:flex-row">
            {features.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="group flex w-full flex-col items-start justify-start gap-1 whitespace-normal rounded-md border p-4 text-left shadow-none transition-opacity duration-200 hover:border-muted hover:opacity-80 data-[state=active]:bg-muted data-[state=active]:shadow-none"
              >
                <div className="flex items-center gap-2 md:flex-col md:items-start lg:gap-4">
                  {tab.icon && (
                    <span className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-opacity duration-200 group-data-[state=active]:bg-primary group-data-[state=active]:text-primary-foreground lg:size-10">
                      {tab.icon}
                    </span>
                  )}
                  <p className="text-lg font-semibold transition-opacity duration-200 md:text-2xl lg:text-xl">
                    {tab.heading}
                  </p>
                </div>
                <p className="font-normal text-muted-foreground transition-opacity duration-200 md:block">
                  {tab.description}
                </p>
              </TabsTrigger>
            ))}
          </TabsList>
          {features.map((tab) => (
            <TabsContent
              key={tab.id}
              value={tab.id}
              className="transition-opacity duration-300"
            >
              {/* Image intentionally removed */}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export { Feature51 };

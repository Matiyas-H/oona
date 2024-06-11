import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SubscriptionPlan, UserSubscriptionPlan } from "@/types";

import { testimonials } from "@/config/landing";
import { useSigninModal } from "@/hooks/use-signin-modal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HeaderSection } from "@/components/shared/header-section";
import { Icons } from "@/components/shared/icons";

import { Contact } from "../contact";

const pricingFaqData = [
  {
    id: "item-1",
    question:
      " How does Omnia Voice AI understand and respond to customer queries?",
    answer:
      "Omnia uses advanced Natural Language Processing (NLP) and Machine Learning (ML) technologies to comprehend customer inquiries and provide accurate, natural responses.",
  },
  {
    id: "item-2",
    question:
      "Can Omnia Voice AI scale to handle my company's growing customer support needs?",
    answer:
      "Absolutely. Omnia is designed to scale seamlessly as your business grows, ensuring consistent, high-quality support for your expanding customer base",
  },
  {
    id: "item-3",
    question:
      "What kind of support does Omnia Voice AI provide to my customer service team?",
    answer:
      "Omnia acts as a tireless assistant to your team, handling routine inquiries, providing customer context, and freeing up your agents to focus on high-value, complex cases. It empowers your team to deliver exceptional customer service.",
  },
  {
    id: "item-4",
    question:
      "Can Omnia Voice AI be customized to match my brand's voice and tone?",
    answer:
      "Omnia can be tailored to align with your brand's unique personality, ensuring a consistent and authentic customer experience",
  },
  {
    id: "item-5",
    question:
      "How does Omnia Voice AI integrate with my existing customer service systems?",
    answer:
      "Omnia seamlessly integrates with popular CRM, helpdesk, and other customer service platforms through APIs, ensuring smooth data flow and synchronization.",
  },
  {
    id: "item-6",
    question:
      "How does Omina Voice AI handle complex or sensitive customer issues?",
    answer:
      "Omnia encounters a complex issue that requires human intervention, it intelligently routes the conversation to the appropriate human agent, providing them with full context for efficient resolution.",
  },
];

export function Testimonials() {
  return (
    <section>
      {/* <div className="container flex max-w-7xl flex-col gap-10 py-32 sm:gap-y-16">
        <HeaderSection
          label="Testimonials"
          title="What our clients are sharing."
          subtitle="Discover the glowing feedback from our delighted customers worldwide."
        />

        <div className="column-1 gap-5 space-y-5 md:columns-2 lg:columns-3 xl:columns-4">
          {testimonials.map((item) => (
            <div className="break-inside-avoid" key={item.name}>
              <div className="relative rounded-xl border bg-muted/25">
                <div className="flex flex-col px-4 py-5 sm:p-6">
                  <div>
                    <div className="relative mb-4 flex items-center gap-3">
                      <span className="relative inline-flex size-10 shrink-0 items-center justify-center rounded-full text-base">
                        <Image
                          width={100}
                          height={100}
                          className="size-full rounded-full border"
                          src={item.image}
                          alt={item.name}
                        />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {item.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.job}
                        </p>
                      </div>
                    </div>
                    <q className="text-muted-foreground">{item.review}</q>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div> */}
      <section>
        <section className="container max-w-4xl py-2">
          <HeaderSection
            label="FAQ"
            title="Frequently Asked Questions"
            subtitle="Explore our comprehensive FAQ to find quick answers to common
          inquiries. If you need further assistance, don't hesitate to
          contact us for personalized help."
          />

          <Accordion type="single" collapsible className="my-12 w-full">
            {pricingFaqData.map((faqItem) => (
              <AccordionItem key={faqItem.id} value={faqItem.id}>
                <AccordionTrigger>{faqItem.question}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground sm:text-[15px]">
                  {faqItem.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </section>
      {/* <Contact /> */}
    </section>
  );
}

//switchboard
100k // volume per month
45-50sec //waiting time
50agent //concurrent calls


//





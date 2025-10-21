"use client";

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
    question: "What makes the Omnia Voice architecture different from a typical STT + LLM pipeline?",
    answer:
      "We encode raw audio directly into the LLM’s embedding space, so paralinguistic cues and meaning are processed together. There’s no stand-alone ASR stage to tune or fail, which cuts error propagation and keeps the turn-taking loop tight.",
  },
  {
    id: "item-2",
    question: "What latency should we expect on the hosted platform versus self-managed?",
    answer:
      "Hosted Omnia Voice is tuned for ~250 ms first-token response with processing beginning while the caller speaks. Dedicated clusters keep the same budget with reserved GPUs, and self-managed deployments inherit the same code path—we help you size hardware so the turn-taking profile stays consistent.",
  },
  {
    id: "item-3",
    question: "Can we move from hosted to our own cloud without rebuilding everything?",
    answer:
      "Yes. The control plane, APIs, and observability are identical. We typically run pilot workloads on hosted Omnia, graduate you to a dedicated cluster, and then help you stand up the self-managed stack on your GPU footprint with our containers, runbooks, and ongoing support.",
  },
  {
    id: "item-4",
    question: "How does Omnia integrate with our existing telephony and tooling?",
    answer:
      "Ingress can be WebRTC, SIP, PSTN, or WebSocket. We maintain connectors for Twilio, Telnyx, and Plivo, and you can trigger downstream systems through HTTP tools or webhooks—no brittle middleware required.",
  },
  {
    id: "item-5",
    question: "What about compliance, data retention, and security?",
    answer:
      "Hosted traffic stays encrypted in transit and at rest with configurable recording and retention policies. Self-managed customers keep audio and metadata entirely inside their own environment, while we continue to ship updates and tooling from the same release train.",
  },
  {
    id: "item-6",
    question: "Do you still support multilingual and expressive conversations?",
    answer:
      "Yes. The unified audio-text representation preserves tone, pauses, and language shifts, so the LLM reacts to how something is said as well as what’s being said. One model can cover multiple languages without swapping providers.",
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
// 100k // volume per month
// 45-50sec //waiting time
// 50agent //concurrent calls


//



import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { HeaderSection } from "./shared/header-section";

const pricingFaqData = [
  {
    id: "item-1",
    question: "What do I get with the free plan?",
    answer:
      "Our free plan includes 120 credits per month (approximately 15 minutes of voice and 30 minutes of speech-to-text), 1 agent, and 2 concurrent connections. It's perfect for trying out the platform.",
  },
  {
    id: "item-2",
    question: "What are credits and how do they work?",
    answer:
      "Credits are our unified billing unit. Voice generation costs approximately 8 credits per minute, while speech-to-text costs about 4 credits per minute. All plans include a monthly credit allowance that refreshes each billing cycle.",
  },
  {
    id: "item-3",
    question: "Do you offer annual billing?",
    answer:
      "Yes, we offer annual billing with a 17% discount on all paid plans. For example, the Pro plan is $99/month or $990/year (saving $198 annually).",
  },
  {
    id: "item-4",
    question: "What is credit rollover?",
    answer:
      "Starting with the Pro plan, unused credits roll over to the next month. Pro allows 1 month rollover, Scale allows 2 months, and Business/Business Plus allow 3 months of rollover.",
  },
  {
    id: "item-5",
    question: "What does concurrency mean?",
    answer:
      "Concurrency refers to the number of simultaneous voice sessions your account can handle. Higher plans support more concurrent connections, from 2 on Free up to 100+ on Enterprise.",
  },
  {
    id: "item-6",
    question: "Can I upgrade or downgrade my plan?",
    answer:
      "Yes, you can change your plan at any time. When upgrading, you'll get immediate access to the new features. When downgrading, changes take effect at your next billing cycle.",
  },
];

export function PricingFaq() {
  return (
    <section className="container max-w-4xl py-16">
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
  );
}

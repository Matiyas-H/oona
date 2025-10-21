"use client";

import { useEffect, useRef, useState } from "react";
import {
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { twMerge } from "tailwind-merge";

import Tag from "@/components/Tag";

import { HeaderSection } from "../shared/header-section";

// Define sentences for scroll animation
const sentences = [
  "Every millisecond counts in a conversation.",
  "But the current voice AI stack wasn’t built for real-time.",
  "Omnia Voice is one unified infrastructure for streaming, reasoning, and response.",
  "Keep your latency low and your data where it belongs: with you.",
];

export default function Introduction() {
  const scrollTarget = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: scrollTarget,
    offset: ["start end", "end end"],
  });

  const [currentSentence, setCurrentSentence] = useState(0);

  const sentenceIndex = useTransform(
    scrollYProgress,
    [0, 1],
    [0, sentences.length],
  );

  useEffect(() => {
    sentenceIndex.on("change", (latest) => {
      setCurrentSentence(Math.floor(latest));
    });
  }, [sentenceIndex]);

  return (
    <section className="py-12 lg:py-20">
      <div className="container max-w-6xl">
        <div className="sticky top-28 md:top-32">
          <div className="flex justify-center">
            <Tag>Infrastructure for Real-Time Voice</Tag>
          </div>

          <div className="mx-auto mt-10 text-left font-heading text-2xl font-medium md:text-4xl lg:text-5xl">
            {sentences.map((sentence, index) => (
              <p
                key={index}
                className={twMerge(
                  "mb-4 transition-opacity duration-500",
                  index <= currentSentence ? "opacity-100" : "opacity-20",
                )}
              >
                {sentence}
              </p>
            ))}
            <p className="mt-6 text-3xl md:text-4xl lg:text-5xl">
              <span className="text-blue-500">Omnia Voice:</span> Hosted for
              speed, portable for control.
            </p>
          </div>
        </div>
        <div ref={scrollTarget} className="h-[150vh]"></div>
      </div>
    </section>
  );
}

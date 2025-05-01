"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { twMerge } from "tailwind-merge";



import Tag from "@/components/Tag";



import { HeaderSection } from "../shared/header-section";


// Define sentences for scroll animation
const sentences = [
  "Missed calls mean missed opportunities.",
  "Your customers still want to talk. Your team can't be everywhere.",
  "Traditional voice systems create frustration, not solutions.",
  "Your phone system should be turning conversations into revenue.",
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
    <section className="py-28 lg:py-40">
      <div className="container max-w-6xl">
        <div className="sticky top-28 md:top-32">
          <div className="flex justify-center">
            <Tag>Intelligent Voice AI for Business</Tag>
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
              <span className="text-purple-400">Omnia Voice:</span> Human-like
              conversation at machine scale.
            </p>
          </div>
        </div>
        <div ref={scrollTarget} className="h-[150vh]"></div>
      </div>
    </section>
  );
}
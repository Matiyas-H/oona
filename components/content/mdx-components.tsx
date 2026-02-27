"use client";

import * as React from "react";
import NextImage, { ImageProps } from "next/image";
import { useMDXComponent } from "next-contentlayer/hooks";

import { cn } from "@/lib/utils";
import { MdxCard } from "@/components/content/mdx-card";
import { Callout } from "@/components/shared/callout";

const components = {
  h1: ({ className, ...props }) => (
    <h1
      className={cn(
        "mt-2 scroll-m-20 font-heading text-4xl font-bold tracking-tight text-[#1a1a1a]",
        className,
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }) => (
    <h2
      className={cn(
        "mt-10 scroll-m-20 border-b border-[#1a1a1a]/10 pb-2 font-heading text-3xl font-semibold tracking-tight text-[#1a1a1a] first:mt-0",
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={cn(
        "mt-8 scroll-m-20 font-heading text-2xl font-semibold tracking-tight text-[#1a1a1a]",
        className,
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }) => (
    <h4
      className={cn(
        "mt-8 scroll-m-20 font-heading text-xl font-semibold tracking-tight text-[#1a1a1a]",
        className,
      )}
      {...props}
    />
  ),
  h5: ({ className, ...props }) => (
    <h5
      className={cn(
        "mt-8 scroll-m-20 font-heading text-lg font-semibold tracking-tight text-[#1a1a1a]",
        className,
      )}
      {...props}
    />
  ),
  h6: ({ className, ...props }) => (
    <h6
      className={cn(
        "mt-8 scroll-m-20 font-heading text-base font-semibold tracking-tight text-[#1a1a1a]",
        className,
      )}
      {...props}
    />
  ),
  a: ({ className, ...props }) => (
    <a
      className={cn("font-medium text-[#2D5A27] underline underline-offset-4 hover:text-[#2D5A27]/80", className)}
      {...props}
    />
  ),
  p: ({ className, ...props }) => (
    <p
      className={cn("leading-7 text-[#1a1a1a]/70 [&:not(:first-child)]:mt-6", className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }) => (
    <ul className={cn("my-6 ml-6 list-disc text-[#1a1a1a]/70", className)} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol className={cn("my-6 ml-6 list-decimal text-[#1a1a1a]/70", className)} {...props} />
  ),
  li: ({ className, ...props }) => (
    <li className={cn("mt-2", className)} {...props} />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        "mt-6 border-l-4 border-[#2D5A27]/30 pl-6 italic text-[#1a1a1a]/60",
        className,
      )}
      {...props}
    />
  ),
  img: ({
    className,
    alt,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={cn("rounded-md border border-[#1a1a1a]/10", className)} alt={alt} {...props} />
  ),
  hr: ({ ...props }) => <hr className="my-4 border-[#1a1a1a]/10 md:my-8" {...props} />,
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className={cn("w-full border-collapse", className)} {...props} />
    </div>
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={cn("m-0 border-t border-[#1a1a1a]/10 p-0 even:bg-[#1a1a1a]/[0.02]", className)}
      {...props}
    />
  ),
  th: ({ className, ...props }) => (
    <th
      className={cn(
        "border border-[#1a1a1a]/10 px-4 py-2 text-left font-heading font-semibold text-[#1a1a1a] [&[align=center]]:text-center [&[align=right]]:text-right",
        className,
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }) => (
    <td
      className={cn(
        "border border-[#1a1a1a]/10 px-4 py-2 text-left text-[#1a1a1a]/70 [&[align=center]]:text-center [&[align=right]]:text-right",
        className,
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        "mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border border-[#1a1a1a]/10 bg-[#1a1a1a] py-4",
        className,
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }) => (
    <code
      className={cn(
        "relative rounded bg-[#1a1a1a]/5 px-[0.3rem] py-[0.2rem] font-mono text-sm text-[#1a1a1a]",
        className,
      )}
      {...props}
    />
  ),
  Image: (props: ImageProps) => <NextImage {...props} />,
  Callout,
  Card: MdxCard,
};

interface MdxProps {
  code: string;
  raw?: string;
}

export function Mdx({ code }: MdxProps) {
  const Component = useMDXComponent(code);

  return (
    <div className="mdx">
      <Component components={components} />
    </div>
  );
}

"use client";

import * as React from "react";
import NextImage, { ImageProps } from "next/image";
import { useMDXComponent } from "next-contentlayer/hooks";

import { cn } from "@/lib/utils";
import { MdxCard } from "@/components/content/mdx-card";
import { CookieSettings } from "@/components/cookie-settings";
import { Callout } from "@/components/shared/callout";

/**
 * Long-form typography for the redesign: blog posts now, the comparison and
 * legal pages next. Same element map as components/content/mdx-components,
 * but every colour is a theme token, so it follows Dark, Bright and Light.
 */
const heading = "font-heading tracking-[-0.01em] text-[color:var(--ov-text)] scroll-mt-20";

const components = {
  h1: ({ className, ...props }) => (
    <h1 className={cn(heading, "mt-12 text-4xl leading-[1.1]", className)} {...props} />
  ),
  h2: ({ className, ...props }) => (
    <h2
      className={cn(
        heading,
        "mt-14 border-t border-[color:var(--ov-line)] pt-8 text-[1.75rem] leading-[1.15] first:mt-0 first:border-0 first:pt-0",
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3 className={cn(heading, "mt-10 text-xl leading-snug", className)} {...props} />
  ),
  h4: ({ className, ...props }) => (
    <h4 className={cn(heading, "mt-8 text-lg", className)} {...props} />
  ),
  h5: ({ className, ...props }) => (
    <h5 className={cn(heading, "mt-8 text-base", className)} {...props} />
  ),
  h6: ({ className, ...props }) => (
    <h6 className={cn(heading, "mt-8 text-base", className)} {...props} />
  ),
  a: ({ className, ...props }) => (
    <a
      className={cn(
        "text-[color:var(--ov-accent)] underline decoration-[color:var(--ov-accent-line)] underline-offset-4 transition-colors hover:decoration-[color:var(--ov-accent)]",
        className,
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }) => (
    <p
      className={cn(
        "text-[1.0625rem] leading-[1.75] text-[color:var(--ov-text-soft)] [&:not(:first-child)]:mt-6",
        className,
      )}
      {...props}
    />
  ),
  strong: ({ className, ...props }) => (
    <strong className={cn("font-semibold text-[color:var(--ov-text)]", className)} {...props} />
  ),
  ul: ({ className, ...props }) => (
    <ul
      className={cn(
        "my-6 space-y-2 text-[1.0625rem] leading-[1.7] text-[color:var(--ov-text-soft)] [&>li]:relative [&>li]:pl-6 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-[0.7em] [&>li]:before:size-1.5 [&>li]:before:bg-[color:var(--ov-accent)]",
        className,
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }) => (
    <ol
      className={cn(
        "my-6 ml-6 list-decimal space-y-2 text-[1.0625rem] leading-[1.7] text-[color:var(--ov-text-soft)] marker:text-[color:var(--ov-muted)]",
        className,
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }) => <li className={cn("pl-1", className)} {...props} />,
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        "my-8 border-l-2 border-[color:var(--ov-accent)] pl-6 font-heading text-xl leading-snug text-[color:var(--ov-text)] [&>p]:text-inherit",
        className,
      )}
      {...props}
    />
  ),
  img: ({ className, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={cn("my-8 border border-[color:var(--ov-line)]", className)}
      alt={alt}
      {...props}
    />
  ),
  hr: ({ ...props }) => <hr className="my-12 border-[color:var(--ov-line)]" {...props} />,
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-8 w-full overflow-x-auto border border-[color:var(--ov-line)]">
      <table className={cn("w-full border-collapse text-[15px]", className)} {...props} />
    </div>
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className={cn("border-t border-[color:var(--ov-line)] first:border-t-0", className)} {...props} />
  ),
  th: ({ className, ...props }) => (
    <th
      className={cn(
        "bg-[color:var(--ov-hover)] px-4 py-3 text-left font-heading text-[color:var(--ov-text)] [&[align=center]]:text-center [&[align=right]]:text-right",
        className,
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }) => (
    <td
      className={cn(
        "px-4 py-3 text-left align-top text-[color:var(--ov-text-soft)] [&[align=center]]:text-center [&[align=right]]:text-right",
        className,
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        "ov-panel my-8 max-h-[650px] overflow-x-auto border border-black/30 p-4 text-[13px] leading-relaxed",
        className,
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }) => (
    <code
      className={cn(
        "bg-[color:var(--ov-hover)] px-[0.3rem] py-[0.15rem] font-mono text-[0.9em] text-[color:var(--ov-text)] [pre_&]:bg-transparent [pre_&]:p-0",
        className,
      )}
      {...props}
    />
  ),
  Image: (props: ImageProps) => <NextImage {...props} />,
  Callout,
  CookieSettings,
  Card: MdxCard,
};

export function RedesignMdx({ code }: { code: string }) {
  const Component = useMDXComponent(code);
  return <Component components={components} />;
}

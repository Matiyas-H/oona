import * as React from "react";
import NextImage, { ImageProps } from "next/image";

import { cn } from "@/lib/utils";
import { MdxCard } from "@/components/content/mdx-card";
import { Callout } from "@/components/shared/callout";

const components = {
  h1: ({ className, ...props }) => (
    <h1
      className={cn(
        "mt-2 scroll-m-20 text-4xl font-bold tracking-tight",
        className,
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }) => (
    <h2
      className={cn(
        "mt-10 scroll-m-20 border-b pb-1 text-2xl font-semibold tracking-tight first:mt-0",
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={cn(
        "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight",
        className,
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }) => (
    <h4
      className={cn(
        "mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
        className,
      )}
      {...props}
    />
  ),
  h5: ({ className, ...props }) => (
    <h5
      className={cn(
        "mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
        className,
      )}
      {...props}
    />
  ),
  h6: ({ className, ...props }) => (
    <h6
      className={cn(
        "mt-8 scroll-m-20 text-base font-semibold tracking-tight",
        className,
      )}
      {...props}
    />
  ),
  a: ({ className, ...props }) => (
    <a
      className={cn("font-medium underline underline-offset-4", className)}
      {...props}
    />
  ),
  p: ({ className, ...props }) => (
    <p
      className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }) => (
    <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
  ),
  li: ({ className, ...props }) => (
    <li className={cn("mt-2", className)} {...props} />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        "mt-6 border-l-2 pl-6 italic [&>*]:text-muted-foreground",
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
    <img className={cn("rounded-md border", className)} alt={alt} {...props} />
  ),
  hr: ({ ...props }) => <hr className="my-4 md:my-8" {...props} />,
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className={cn("w-full", className)} {...props} />
    </div>
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={cn("m-0 border-t p-0 even:bg-muted", className)}
      {...props}
    />
  ),
  th: ({ className, ...props }) => (
    <th
      className={cn(
        "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
        className,
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }) => (
    <td
      className={cn(
        "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
        className,
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        "mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border bg-zinc-900 py-4 dark:bg-zinc-900",
        className,
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }) => (
    <code
      className={cn(
        "relative px-[0.3rem] py-[0.2rem] font-mono text-sm",
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

export function Mdx({ code, raw }: MdxProps) {
  const processMarkdown = (markdown: string) => {
    if (!markdown) return '';
    
    // Clean the markdown
    let clean = markdown
      .replace(/^---[\s\S]*?---\n?/m, '') // Remove frontmatter
      .replace(/^export\s+const\s+[\s\S]*?^\s*$/gm, '') // Remove export blocks
      .replace(/^import\s+.*$/gm, '') // Remove imports
      .trim();
    
    // Split into paragraphs and process each
    const paragraphs = clean.split(/\n\s*\n/);
    
    return paragraphs.map(para => {
      para = para.trim();
      if (!para) return '';
      
      // Headers
      if (para.startsWith('### ')) {
        return `<h3 class="mt-8 mb-4 text-2xl font-semibold">${para.substring(4)}</h3>`;
      }
      if (para.startsWith('## ')) {
        return `<h2 class="mt-10 mb-4 text-3xl font-semibold border-b pb-2">${para.substring(3)}</h2>`;
      }
      if (para.startsWith('# ')) {
        return `<h1 class="mt-2 mb-6 text-4xl font-bold">${para.substring(2)}</h1>`;
      }
      
      // Lists
      if (para.includes('\n- ') || para.startsWith('- ')) {
        const items = para.split('\n').filter(line => line.startsWith('- ')).map(line => 
          `<li class="mb-1">${line.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`
        ).join('');
        return `<ul class="my-4 ml-6 list-disc space-y-1">${items}</ul>`;
      }
      
      // Tables
      if (para.includes('|') && para.includes('\n')) {
        const lines = para.split('\n').filter(line => line.includes('|'));
        if (lines.length > 1) {
          const rows = lines.map(line => {
            const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell && cell !== '---');
            if (cells.length === 0) return '';
            return `<tr>${cells.map(cell => `<td class="border px-3 py-2">${cell}</td>`).join('')}</tr>`;
          }).filter(row => row);
          return `<table class="my-6 w-full border-collapse border">${rows.join('')}</table>`;
        }
      }
      
      // Blockquotes
      if (para.startsWith('> ')) {
        return `<blockquote class="my-4 border-l-4 pl-4 italic text-gray-600">${para.substring(2)}</blockquote>`;
      }
      
      // Regular paragraphs
      let processed = para
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 underline">$1</a>')
        .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>');
      
      return `<p class="my-4 leading-relaxed">${processed}</p>`;
    }).join('');
  };

  return (
    <div className="mdx">
      <div className="prose-slate max-w-none">
        {raw ? (
          <div 
            dangerouslySetInnerHTML={{ __html: processMarkdown(raw) }}
          />
        ) : (
          <p>Content loading...</p>
        )}
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";
import { format } from "date-fns";
import { allAuthors, allPosts } from "contentlayer/generated";

import { Mdx } from "@/components/content/mdx-components";

import "@/styles/mdx.css";

import { Metadata } from "next";
import Link from "next/link";

import { env } from "@/env.mjs";
import { absoluteUrl, cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PostPageProps {
  params: {
    slug: string[];
  };
}

async function getPostFromParams(params) {
  const slug = params?.slug?.join("/");
  const post = allPosts.find((post) => post.slugAsParams === slug);

  if (!post) {
    return null;
  }

  return post;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const post = await getPostFromParams(params);

  if (!post) {
    return {};
  }

  const url = env.NEXT_PUBLIC_APP_URL;

  const ogUrl = new URL(`${url}/api/og`);
  ogUrl.searchParams.set("heading", post.title);
  ogUrl.searchParams.set("type", "Blog Post");
  ogUrl.searchParams.set("mode", "dark");

  return {
    title: post.title,
    description: post.description,
    authors: post.authors.map((author) => ({
      name: author,
    })),
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: absoluteUrl(post.slug),
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogUrl.toString()],
    },
  };
}

export async function generateStaticParams(): Promise<
  PostPageProps["params"][]
> {
  return allPosts.map((post) => ({
    slug: post.slugAsParams.split("/"),
  }));
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostFromParams(params);

  if (!post) {
    notFound();
  }

  // Get first author name for display
  const authorName = post.authors?.[0] || "Omnia-Voice";

  return (
    <section className="bg-[#FAFAF9] py-32">
      <div className="container">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
          <h1 className="max-w-3xl text-pretty font-heading text-5xl font-semibold tracking-tight text-[#1a1a1a] md:text-6xl">
            {post.title}
          </h1>
          <h3 className="max-w-3xl text-lg text-[#1a1a1a]/60 md:text-xl">
            {post.description}
          </h3>
          <div className="flex items-center gap-3 text-sm text-[#1a1a1a]/70 md:text-base">
            <Avatar className="size-8 border border-[#1a1a1a]/10">
              <AvatarFallback className="bg-[#2D5A27]/10 text-[#2D5A27]">{authorName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span>
              <span className="font-semibold text-[#1a1a1a]">{authorName}</span>
              {post.date && (
                <span className="ml-1">on {format(new Date(post.date), "MMMM d, yyyy")}</span>
              )}
            </span>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <Mdx code={post.body.code} />
        </div>
        <div className="mx-auto mt-12 flex max-w-3xl justify-center">
          <Link href="/blog" className="inline-flex items-center border border-[#1a1a1a]/20 bg-transparent px-6 py-2 text-sm font-medium tracking-wide text-[#1a1a1a] transition-all hover:border-[#1a1a1a]/40 hover:bg-[#1a1a1a]/5">
            <Icons.chevronLeft className="mr-2 size-4" />
            See all posts
          </Link>
        </div>
      </div>
    </section>
  );
}

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
    <section className="py-32">
      <div className="container">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
          <h1 className="max-w-3xl text-pretty text-5xl font-semibold md:text-6xl">
            {post.title}
          </h1>
          <h3 className="max-w-3xl text-lg text-muted-foreground md:text-xl">
            {post.description}
          </h3>
          <div className="flex items-center gap-3 text-sm md:text-base">
            <Avatar className="size-8 border">
              <AvatarFallback>{authorName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span>
              <span className="font-semibold">{authorName}</span>
              {post.date && (
                <span className="ml-1">on {format(new Date(post.date), "MMMM d, yyyy")}</span>
              )}
            </span>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="prose prose-slate mx-auto max-w-3xl dark:prose-invert">
          <Mdx code={post.body.code} raw={post.body.raw} />
        </div>
        <div className="mx-auto mt-12 flex max-w-3xl justify-center">
          <Link href="/blog" className={cn(buttonVariants({ variant: "ghost" }))}>
            <Icons.chevronLeft className="mr-2 size-4" />
            See all posts
          </Link>
        </div>
      </div>
    </section>
  );
}

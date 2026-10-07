import Link from "next/link";
import { notFound } from "next/navigation";
import { allPosts } from "contentlayer/generated";
import { format } from "date-fns";

import { frame } from "@/components/redesign/frame";
import { RedesignMdx } from "@/components/redesign/mdx";

interface PostPageProps {
  params: { slug: string[] };
}

function getPost(params: PostPageProps["params"]) {
  const slug = params?.slug?.join("/");
  return allPosts.find((post) => post.slugAsParams === slug) ?? null;
}

export function generateMetadata({ params }: PostPageProps) {
  const post = getPost(params);
  return post ? { title: `${post.title} — redesign preview` } : {};
}

export function generateStaticParams(): PostPageProps["params"][] {
  return allPosts.map((post) => ({ slug: post.slugAsParams.split("/") }));
}

const textLink =
  "border-b border-[color:var(--ov-accent-line)] pb-0.5 text-[15px] text-[color:var(--ov-accent)] transition-colors hover:border-[color:var(--ov-accent)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--ov-accent)]";

export default function RedesignPostPage({ params }: PostPageProps) {
  const post = getPost(params);
  if (!post) notFound();

  const author = post.authors?.[0] === "omnia-voice" ? "Omnia Voice" : post.authors?.[0];

  return (
    <article>
      <header className="border-b border-[color:var(--ov-line)]">
        <div className={`${frame} px-5 pb-14 pt-10 md:px-12 md:pb-20 md:pt-14`}>
          <Link href="/redesign/blog" className={textLink}>
            All posts
          </Link>
          <h1 className="mt-10 max-w-[22ch] font-heading text-[2.5rem] leading-[1.02] tracking-[-0.02em] md:text-[4rem]">
            {post.title}
          </h1>
          {post.description && (
            <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-[color:var(--ov-muted)] md:text-xl">
              {post.description}
            </p>
          )}
          <p className="mt-8 text-sm text-[color:var(--ov-muted)]">
            {author && <span className="text-[color:var(--ov-text)]">{author}</span>}
            {author && post.date && ", "}
            {post.date && (
              <time dateTime={post.date}>{format(new Date(post.date), "d MMMM yyyy")}</time>
            )}
          </p>
        </div>
      </header>

      {/* The text column sits left-aligned on the frame's grid, at a reading
          measure, rather than centred in empty space. */}
      <div className="border-b border-[color:var(--ov-line)]">
        <div className={`${frame} px-5 py-14 md:px-12 md:py-20`}>
          <div className="max-w-[68ch]">
            <RedesignMdx code={post.body.code} />
          </div>
        </div>
      </div>

      <div className="border-b border-[color:var(--ov-line)]">
        <div className={`${frame} flex flex-wrap items-center justify-between gap-6 px-5 py-10 md:px-12`}>
          <Link href="/redesign/blog" className={textLink}>
            All posts
          </Link>
          <Link
            href="https://dashboard.omnia-voice.com/register"
            className="inline-flex h-12 items-center bg-[color:var(--ov-brand)] px-7 text-[15px] font-medium text-[color:var(--ov-on-brand)] transition-colors hover:bg-[color:var(--ov-brand-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ov-accent)]"
          >
            Start building
          </Link>
        </div>
      </div>
    </article>
  );
}

import Link from "next/link";
import { allPosts } from "contentlayer/generated";
import { compareDesc, format } from "date-fns";

import { frame } from "@/components/redesign/frame";

export const metadata = {
  title: "Blog — redesign preview",
};

export default function RedesignBlogPage() {
  const posts = allPosts
    .filter((post) => post.published)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  return (
    <>
      <section className="border-b border-[color:var(--ov-line)]">
        <div className={`${frame} px-5 py-16 md:px-12 md:py-24`}>
          <h1 className="font-heading text-[3rem] leading-[0.95] tracking-[-0.02em] md:text-[5rem]">
            Blog.
          </h1>
          <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-[color:var(--ov-muted)] md:text-xl">
            Notes on voice AI in production: what we build, what our customers
            run, and how our partners ship it.
          </p>
        </div>
      </section>

      <section className="border-b border-[color:var(--ov-line)]">
        {/* One row per post, newest first. The whole row is the link. */}
        <ol className={`${frame} divide-y divide-[color:var(--ov-line)]`}>
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/redesign${post.slug}`}
                className="group grid gap-3 px-5 py-10 transition-colors hover:bg-[color:var(--ov-hover)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[color:var(--ov-accent)] md:grid-cols-[11rem_minmax(0,1fr)_auto] md:gap-10 md:px-12"
              >
                <time
                  dateTime={post.date}
                  className="pt-1.5 text-sm tabular-nums text-[color:var(--ov-muted)]"
                >
                  {format(new Date(post.date), "d MMMM yyyy")}
                </time>
                <div>
                  <h2 className="max-w-[30ch] font-heading text-2xl leading-[1.15] md:text-[1.875rem]">
                    {post.title}
                  </h2>
                  {post.description && (
                    <p className="mt-3 max-w-[64ch] leading-relaxed text-[color:var(--ov-muted)]">
                      {post.description}
                    </p>
                  )}
                </div>
                <span className="self-end text-[15px] text-[color:var(--ov-accent)] md:self-center">
                  <span className="border-b border-[color:var(--ov-accent-line)] pb-0.5 transition-colors group-hover:border-[color:var(--ov-accent)]">
                    Read
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}

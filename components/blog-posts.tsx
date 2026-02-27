import { ArrowRight } from "lucide-react";
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export function BlogPosts({ posts }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="container py-6 md:py-10">
        <p className="text-[#1a1a1a]/60">No blog posts available.</p>
      </div>
    );
  }

  return (
    <section className="bg-[#FAFAF9] py-32">
      <div className="container mx-auto flex flex-col items-center gap-16 lg:px-16">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 border border-[#1a1a1a]/10 bg-white px-4 py-2 text-xs font-medium tracking-wide text-[#1a1a1a]/70">
            <span className="size-1.5 rounded-full bg-[#2D5A27]" />
            LATEST UPDATES
          </div>
          <h2 className="mb-3 text-pretty font-heading text-3xl font-semibold tracking-tight text-[#1a1a1a] md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl">
            Blog Posts
          </h2>
          <p className="mb-8 text-[#1a1a1a]/60 md:text-base lg:max-w-2xl lg:text-lg">
            Discover the latest insights on voice AI automation, customer service transformation, and conversational AI solutions from Omnia-Voice.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {posts.map((post) => (
            <div
              key={post._id}
              className="group grid grid-rows-[auto_1fr_auto] border border-[#1a1a1a]/10 bg-white p-6 transition-all hover:border-[#1a1a1a]/20"
            >
              <div className="mb-4">
                <h3 className="font-heading text-lg font-semibold text-[#1a1a1a] group-hover:text-[#2D5A27] md:text-xl">
                  <Link href={post.slug}>
                    {post.title}
                  </Link>
                </h3>
              </div>
              <div>
                <p className="text-[#1a1a1a]/60">{post.description}</p>
                {post.date && (
                  <p className="mt-3 text-sm text-[#1a1a1a]/40">
                    {formatDate(post.date)}
                  </p>
                )}
              </div>
              <div className="mt-4 border-t border-[#1a1a1a]/10 pt-4">
                <Link
                  href={post.slug}
                  className="inline-flex items-center text-sm font-medium text-[#1a1a1a] hover:text-[#2D5A27]"
                >
                  Read more
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


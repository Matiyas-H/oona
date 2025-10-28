import { ArrowRight } from "lucide-react";
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export function BlogPosts({ posts }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="container py-6 md:py-10">
        <p className="text-muted-foreground">No blog posts available.</p>
      </div>
    );
  }

  return (
    <section className="py-32">
      <div className="container mx-auto flex flex-col items-center gap-16 lg:px-16">
        <div className="text-center">
          <Badge variant="secondary" className="mb-6">
            Latest Updates
          </Badge>
          <h2 className="mb-3 text-pretty text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl">
            Blog Posts
          </h2>
          <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg">
            Discover the latest insights on voice AI automation, customer service transformation, and conversational AI solutions from Omnia-Voice.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {posts.map((post) => (
            <Card
              key={post._id}
              className="grid grid-rows-[auto_1fr_auto] pt-0"
            >
              <CardHeader>
                <h3 className="text-lg font-semibold hover:underline md:text-xl">
                  <Link href={post.slug}>
                    {post.title}
                  </Link>
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{post.description}</p>
                {post.date && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    {formatDate(post.date)}
                  </p>
                )}
              </CardContent>
              <CardFooter>
                <Link
                  href={post.slug}
                  className="flex items-center text-foreground hover:underline"
                >
                  Read more
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}


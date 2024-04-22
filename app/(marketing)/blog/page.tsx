import { BlogPosts } from "@/public/images/blog/components/blog-posts";
import { allPosts } from "contentlayer/generated";
import { compareDesc } from "date-fns";

export const metadata = {
  title: "Blog",
};

export default async function BlogPage() {
  const posts = allPosts
    .filter((post) => post.published)
    .sort((a, b) => {
      return compareDesc(new Date(a.date), new Date(b.date));
    });

  return (
    <main>
      <BlogPosts posts={posts} />
    </main>
  );
}

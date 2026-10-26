import type { Metadata } from "next";
import { getAllArticles } from "@/lib/content";
import { BlogGrid } from "@/components/BlogGrid";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Articles déco design",
  description: "Tendances, inspirations et conseils pour décorer votre intérieur avec style.",
  path: "/blog",
});

export default function BlogPage() {
  const articles = getAllArticles();

  return (
    <>
      <div className="border-b border-stone-100 bg-white px-4 pb-6 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">Blog</p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-stone-900 sm:text-4xl">
            Articles déco
          </h1>
          <p className="mt-2 text-stone-500">
            Tendances, inspirations et conseils pour un intérieur design.
          </p>
        </div>
      </div>
      <BlogGrid articles={articles} initialFiltre="article" />
    </>
  );
}

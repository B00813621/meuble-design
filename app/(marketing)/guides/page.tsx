import type { Metadata } from "next";
import { getAllArticles } from "@/lib/content";
import { BlogGrid } from "@/components/BlogGrid";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Guides & Articles déco",
  description: "Guides d'achat, articles déco et comparatifs pour choisir le meilleur mobilier design.",
  path: "/guides",
});

export default function GuidesPage() {
  const articles = getAllArticles();

  return (
    <>
      <div className="border-b border-stone-100 bg-white px-4 pb-6 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">Guide</p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-stone-900 sm:text-4xl">
            Guides & Articles
          </h1>
          <p className="mt-2 text-stone-500">
            Guides d'achat, articles déco et comparatifs — tout pour faire le bon choix.
          </p>
        </div>
      </div>
      <BlogGrid articles={articles} initialFiltre="tous" />
    </>
  );
}

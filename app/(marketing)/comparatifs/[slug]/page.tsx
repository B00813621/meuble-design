import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getArticleBySlug, getAllArticles } from "@/lib/content";
import { buildMetadata, jsonLdArticle, jsonLdBreadcrumb } from "@/lib/seo";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ComparisonTable } from "@/components/ComparisonTable";
import { Callout } from "@/components/Callout";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

// Wrap ComparisonTable to inject data from frontmatter (next-mdx-remote v6 RSC doesn't support scope)

export async function generateStaticParams() {
  return getAllArticles("comparatif").map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const result = getArticleBySlug(slug, "comparatif");
  if (!result) return {};
  const { article } = result;
  return buildMetadata({
    title: article.titre,
    description: article.metaDescription,
    path: `/comparatifs/${slug}`,
    type: "article",
    datePublished: article.datePublication,
    dateModified: article.dateMaj,
  });
}

export default async function ComparatifPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = getArticleBySlug(slug, "comparatif");
  if (!result) notFound();
  const { article, content } = result;
  const mdxComponents = {
    ComparisonTable: () => article.comparatif ? <ComparisonTable comparatif={article.comparatif} /> : null,
    Callout,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle(article)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb([
        { name: "Accueil", url: "/" },
        { name: "Comparatifs", url: "/comparatifs" },
        { name: article.titre, url: `/comparatifs/${slug}` },
      ])) }} />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "Comparatifs", href: "/comparatifs" }, { label: article.titre }]} />

        <header className="mb-8">
          <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">Comparatif</span>
          <h1 className="mt-3 font-serif text-3xl font-bold leading-tight text-stone-900 sm:text-4xl">{article.titre}</h1>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-stone-500">
            <time dateTime={article.datePublication}>
              Mis à jour le {new Date(article.dateMaj).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            </time>
            {article.tempsLecture && <span>{article.tempsLecture} min de lecture</span>}
          </div>
        </header>

        {article.contientLiensAffilies && <AffiliateDisclosure />}

        <div className="prose-editorial">
          <MDXRemote source={content} components={mdxComponents} options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }} />
        </div>

        {article.contientLiensAffilies && <div className="mt-8"><AffiliateDisclosure /></div>}
      </div>
    </>
  );
}

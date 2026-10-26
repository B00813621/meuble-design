import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getArticleBySlug, getAllArticles } from "@/lib/content";
import { buildMetadata, jsonLdArticle, jsonLdBreadcrumb } from "@/lib/seo";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { Breadcrumb } from "@/components/Breadcrumb";
import { TableOfContents } from "@/components/TableOfContents";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

export async function generateStaticParams() {
  return getAllArticles("guide").map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const result = getArticleBySlug(slug, "guide");
  if (!result) return {};
  const { article } = result;
  return buildMetadata({
    title: article.titre,
    description: article.metaDescription,
    path: `/guides/${slug}`,
    image: article.image,
    type: "article",
    datePublished: article.datePublication,
    dateModified: article.dateMaj,
  });
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = getArticleBySlug(slug, "guide");
  if (!result) notFound();
  const { article, content } = result;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle(article)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb([
        { name: "Accueil", url: "/" },
        { name: "Guides", url: "/guides" },
        { name: article.titre, url: `/guides/${slug}` },
      ])) }} />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "Guides", href: "/guides" }, { label: article.titre }]} />

        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
          <article>
            <header className="mb-8">
              <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
                Guide d'achat
              </span>
              <h1 className="mt-3 font-serif text-3xl font-bold leading-tight text-stone-900 sm:text-4xl">
                {article.titre}
              </h1>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-stone-500">
                <time dateTime={article.datePublication}>
                  Publié le {new Date(article.datePublication).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </time>
                {article.tempsLecture && <span>{article.tempsLecture} min de lecture</span>}
              </div>
            </header>

            {article.contientLiensAffilies && <AffiliateDisclosure />}

            <div className="prose-editorial">
              <MDXRemote source={content} options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings] } }} />
            </div>

            {article.contientLiensAffilies && <div className="mt-8"><AffiliateDisclosure /></div>}
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-24"><TableOfContents /></div>
          </aside>
        </div>
      </div>
    </>
  );
}

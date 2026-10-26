import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getArticleBySlug, getAllArticles } from "@/lib/content";
import { buildMetadata, jsonLdArticle, jsonLdBreadcrumb, jsonLdFAQ } from "@/lib/seo";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { Breadcrumb } from "@/components/Breadcrumb";
import { TableOfContents } from "@/components/TableOfContents";
import { FAQSection } from "@/components/FAQSection";
import { AuthorBio } from "@/components/AuthorBio";
import { Callout } from "@/components/Callout";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

export async function generateStaticParams() {
  return getAllArticles("article").map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const result = getArticleBySlug(slug, "article");
  if (!result) return {};
  const { article } = result;
  return buildMetadata({
    title: article.titre,
    description: article.metaDescription,
    path: `/blog/${slug}`,
    image: article.image,
    type: "article",
    datePublished: article.datePublication,
    dateModified: article.dateMaj,
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = getArticleBySlug(slug, "article");
  if (!result) notFound();

  const { article, content } = result;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle(article)) }}
      />
      {article.faqs?.length ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ(article.faqs)) }}
        />
      ) : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            jsonLdBreadcrumb([
              { name: "Accueil", url: "/" },
              { name: "Articles", url: "/blog" },
              { name: article.titre, url: `/blog/${slug}` },
            ])
          ),
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Articles", href: "/blog" },
            { label: article.titre },
          ]}
        />

        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
          <article>
            <header className="mb-8">
              <h1 className="font-serif text-3xl font-bold leading-tight text-stone-900 sm:text-4xl">
                {article.titre}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-stone-500">
                <time dateTime={article.datePublication}>
                  Publié le{" "}
                  {new Date(article.datePublication).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
                {article.dateMaj !== article.datePublication && (
                  <time dateTime={article.dateMaj}>
                    Mis à jour le{" "}
                    {new Date(article.dateMaj).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                )}
                {article.tempsLecture && (
                  <span>{article.tempsLecture} min de lecture</span>
                )}
              </div>
            </header>

            {article.contientLiensAffilies && <AffiliateDisclosure />}

            <div className="prose-editorial">
              <MDXRemote
                source={content}
                components={{ Callout }}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
                  },
                }}
              />
            </div>

            {article.contientLiensAffilies && (
              <div className="mt-8">
                <AffiliateDisclosure />
              </div>
            )}

            <FAQSection faqs={article.faqs ?? []} />
            <AuthorBio auteur={article.auteur} dateMaj={article.dateMaj} />
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

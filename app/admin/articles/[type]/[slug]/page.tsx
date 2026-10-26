import { notFound } from "next/navigation";
import { readContent } from "@/lib/admin";
import type { ArticleType } from "@/lib/admin";
import { ArticleForm } from "../../ArticleForm";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ type: string; slug: string }>;
}) {
  const { type, slug } = await params;
  const result = readContent(type as ArticleType, slug);
  if (!result) notFound();

  const { frontmatter, content } = result;

  return (
    <ArticleForm
      initialSlug={slug}
      initialFrontmatter={frontmatter as Parameters<typeof ArticleForm>[0]["initialFrontmatter"]}
      initialContent={content}
      isNew={false}
    />
  );
}

import { NextResponse } from "next/server";
import { listAllContent, writeContent, TYPE_DIR } from "@/lib/admin";
import type { ArticleType } from "@/lib/admin";
import path from "path";
import fs from "fs";

export async function GET() {
  const articles = listAllContent();
  return NextResponse.json(articles);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { type, slug, frontmatter, content } = body as {
    type: ArticleType;
    slug: string;
    frontmatter: Record<string, unknown>;
    content: string;
  };

  if (!type || !slug || !frontmatter) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const safeSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");

  // Check duplicate
  const dir = path.join(process.cwd(), "content", TYPE_DIR[type]);
  if (fs.existsSync(path.join(dir, `${safeSlug}.mdx`))) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  }

  writeContent(type, safeSlug, frontmatter, content ?? "");
  return NextResponse.json({ slug: safeSlug }, { status: 201 });
}

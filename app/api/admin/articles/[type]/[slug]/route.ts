import { NextResponse } from "next/server";
import { readContent, writeContent, deleteContent } from "@/lib/admin";
import type { ArticleType } from "@/lib/admin";

type Params = { params: Promise<{ type: string; slug: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { type, slug } = await params;
  const result = readContent(type as ArticleType, slug);
  if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(result);
}

export async function PUT(req: Request, { params }: Params) {
  const { type, slug } = await params;
  const { frontmatter, content } = await req.json();
  writeContent(type as ArticleType, slug, frontmatter, content ?? "");
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: Params) {
  const { type, slug } = await params;
  deleteContent(type as ArticleType, slug);
  return NextResponse.json({ ok: true });
}

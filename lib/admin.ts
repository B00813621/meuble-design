import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");
const PUBLIC_IMAGES_DIR = path.join(process.cwd(), "public", "images");

export type ArticleType = "article" | "guide" | "comparatif";

export const TYPE_DIR: Record<ArticleType, string> = {
  article: "articles",
  guide: "guides",
  comparatif: "comparatifs",
};

export const TYPE_PATH: Record<ArticleType, string> = {
  article: "blog",
  guide: "guides",
  comparatif: "comparatifs",
};

export function listAllContent() {
  const results: Array<{
    slug: string;
    type: ArticleType;
    titre: string;
    metaDescription: string;
    datePublication: string;
    dateMaj: string;
    auteur?: string;
    contientLiensAffilies: boolean;
    tags: string[];
  }> = [];

  for (const [type, dir] of Object.entries(TYPE_DIR) as [ArticleType, string][]) {
    const fullDir = path.join(CONTENT_DIR, dir);
    if (!fs.existsSync(fullDir)) continue;
    for (const file of fs.readdirSync(fullDir).filter((f) => f.endsWith(".mdx"))) {
      const raw = fs.readFileSync(path.join(fullDir, file), "utf-8");
      const { data } = matter(raw);
      results.push({
        slug: file.replace(/\.mdx$/, ""),
        type,
        titre: data.titre ?? file,
        metaDescription: data.metaDescription ?? "",
        datePublication: data.datePublication ?? "",
        dateMaj: data.dateMaj ?? data.datePublication ?? "",
        auteur: data.auteur,
        contientLiensAffilies: data.contientLiensAffilies ?? false,
        tags: data.tags ?? [],
      });
    }
  }

  return results.sort(
    (a, b) => new Date(b.datePublication).getTime() - new Date(a.datePublication).getTime()
  );
}

export function readContent(type: ArticleType, slug: string) {
  const filePath = path.join(CONTENT_DIR, TYPE_DIR[type], `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { frontmatter: data, content };
}

export function writeContent(type: ArticleType, slug: string, frontmatter: Record<string, unknown>, content: string) {
  const dir = path.join(CONTENT_DIR, TYPE_DIR[type]);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `${slug}.mdx`);
  const serialized = serializeFrontmatter(frontmatter);
  fs.writeFileSync(filePath, `---\n${serialized}---\n\n${content.trim()}\n`, "utf-8");
}

export function deleteContent(type: ArticleType, slug: string) {
  const filePath = path.join(CONTENT_DIR, TYPE_DIR[type], `${slug}.mdx`);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

function serializeFrontmatter(obj: Record<string, unknown>): string {
  const lines: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    if (v === null || v === undefined || v === "") continue;
    if (typeof v === "boolean") {
      lines.push(`${k}: ${v}`);
    } else if (typeof v === "number") {
      lines.push(`${k}: ${v}`);
    } else if (typeof v === "string") {
      lines.push(`${k}: ${JSON.stringify(v)}`);
    } else if (Array.isArray(v)) {
      if (v.length === 0) continue;
      if (typeof v[0] === "object" && v[0] !== null) {
        lines.push(`${k}:`);
        for (const item of v as Record<string, string>[]) {
          const entries = Object.entries(item);
          lines.push(`  - ${entries[0][0]}: ${JSON.stringify(entries[0][1])}`);
          for (const [ek, ev] of entries.slice(1)) {
            lines.push(`    ${ek}: ${JSON.stringify(ev)}`);
          }
        }
      } else {
        lines.push(`${k}:`);
        for (const item of v as string[]) {
          lines.push(`  - ${JSON.stringify(item)}`);
        }
      }
    }
  }
  return lines.join("\n") + "\n";
}

export function listImages(): string[] {
  if (!fs.existsSync(PUBLIC_IMAGES_DIR)) return [];
  const images: string[] = [];
  const walk = (dir: string, base: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.join(base, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath, relPath);
      } else if (/\.(jpg|jpeg|png|webp|gif|svg|avif)$/i.test(entry.name)) {
        images.push("/" + relPath.replace(/\\/g, "/"));
      }
    }
  };
  walk(PUBLIC_IMAGES_DIR, "images");
  return images;
}

export function saveUploadedImage(filename: string, buffer: Buffer): string {
  if (!fs.existsSync(PUBLIC_IMAGES_DIR)) fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  const dest = path.join(PUBLIC_IMAGES_DIR, safe);
  fs.writeFileSync(dest, buffer);
  return `/images/${safe}`;
}

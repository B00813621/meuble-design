import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Article, Produit } from "@/types";

const CONTENT_DIR = path.join(process.cwd(), "content");

// ── Articles / Guides / Comparatifs ─────────────────────────────────────────

function getArticleDir(type: Article["type"]): string {
  const map = { article: "articles", guide: "guides", comparatif: "comparatifs" };
  return path.join(CONTENT_DIR, map[type]);
}

export function getAllArticles(type?: Article["type"]): Article[] {
  const types: Article["type"][] = type ? [type] : ["article", "guide", "comparatif"];
  const articles: Article[] = [];

  for (const t of types) {
    const dir = getArticleDir(t);
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));

    for (const file of files) {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data, content } = matter(raw);
      const slug = file.replace(/\.mdx$/, "");
      articles.push({
        slug,
        titre: data.titre ?? slug,
        metaDescription: data.metaDescription ?? "",
        type: data.type ?? t,
        datePublication: data.datePublication ?? new Date().toISOString(),
        dateMaj: data.dateMaj ?? data.datePublication ?? new Date().toISOString(),
        auteur: data.auteur,
        image: data.image,
        imageAlt: data.imageAlt,
        tags: data.tags ?? [],
        produitsCites: data.produitsCites ?? [],
        contientLiensAffilies: data.contientLiensAffilies ?? false,
        tempsLecture: Math.ceil(readingTime(content).minutes),
      });
    }
  }

  return articles.sort(
    (a, b) =>
      new Date(b.datePublication).getTime() - new Date(a.datePublication).getTime()
  );
}

export function getArticleBySlug(
  slug: string,
  type: Article["type"]
): { article: Article; content: string } | null {
  const dir = getArticleDir(type);
  const filePath = path.join(dir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    article: {
      slug,
      titre: data.titre ?? slug,
      metaDescription: data.metaDescription ?? "",
      type: data.type ?? type,
      datePublication: data.datePublication ?? new Date().toISOString(),
      dateMaj: data.dateMaj ?? data.datePublication ?? new Date().toISOString(),
      auteur: data.auteur,
      image: data.image,
      imageAlt: data.imageAlt,
      tags: data.tags ?? [],
      produitsCites: data.produitsCites ?? [],
      contientLiensAffilies: data.contientLiensAffilies ?? false,
      tempsLecture: Math.ceil(readingTime(content).minutes),
      comparatif: data.comparatif,
    },
    content,
  };
}

// ── Produits ─────────────────────────────────────────────────────────────────

const PRODUITS_DIR = path.join(CONTENT_DIR, "produits");

export function getAllProduits(): Produit[] {
  if (!fs.existsSync(PRODUITS_DIR)) return [];
  return fs
    .readdirSync(PRODUITS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(PRODUITS_DIR, f), "utf-8");
      return JSON.parse(raw) as Produit;
    });
}

export function getProduitBySlug(slug: string): Produit | null {
  const filePath = path.join(PRODUITS_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as Produit;
}

export function getProduitsByCategorie(categorie: string): Produit[] {
  return getAllProduits().filter((p) => p.categorie === categorie);
}

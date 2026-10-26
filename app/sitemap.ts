import type { MetadataRoute } from "next";
import { getAllArticles, getAllProduits } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();
  const produits = getAllProduits();

  const TYPE_PATHS = {
    article: "blog",
    guide: "guides",
    comparatif: "comparatifs",
  };

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/guides`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/comparatifs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/a-propos`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/mentions-legales`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/confidentialite`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/cgu`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/${TYPE_PATHS[a.type]}/${a.slug}`,
    lastModified: new Date(a.dateMaj),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const produitPages: MetadataRoute.Sitemap = produits.map((p) => ({
    url: `${SITE_URL}/produits/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...articlePages, ...produitPages];
}

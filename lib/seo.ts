import type { Metadata } from "next";
import type { Article, Produit, FAQ } from "@/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://meuble-design.fr";
const SITE_NAME = "Meuble Design";
const SITE_DESCRIPTION =
  "Guides, comparatifs et sélections de meubles design accessibles. Trouvez les meilleures offres pour décorer votre intérieur.";

const TYPE_PATHS: Record<Article["type"], string> = {
  article: "blog",
  guide: "guides",
  comparatif: "comparatifs",
};

export function buildMetadata(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  datePublished?: string;
  dateModified?: string;
}): Metadata {
  const url = `${SITE_URL}${opts.path}`;
  const image = opts.image ?? `${SITE_URL}/og-default.jpg`;

  return {
    title: `${opts.title} | ${SITE_NAME}`,
    description: opts.description,
    alternates: {
      canonical: url,
      languages: { "fr-FR": url },
    },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: SITE_NAME,
      locale: "fr_FR",
      type: opts.type ?? "website",
      images: [{ url: image, width: 1200, height: 630, alt: opts.title }],
      ...(opts.datePublished && { publishedTime: opts.datePublished }),
      ...(opts.dateModified && { modifiedTime: opts.dateModified }),
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

// ── JSON-LD helpers ──────────────────────────────────────────────────────────

export function jsonLdOrganization() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png`, width: 200, height: 60 },
    sameAs: [],
  };
}

export function jsonLdWebSite() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/recherche?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function jsonLdArticle(article: Article) {
  const path = TYPE_PATHS[article.type];
  return {
    "@context": "https://schema.org",
    "@type": article.type === "guide" ? "HowTo" : "Article",
    headline: article.titre,
    description: article.metaDescription,
    datePublished: article.datePublication,
    dateModified: article.dateMaj,
    author: {
      "@type": "Person",
      name: article.auteur ?? SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/${path}/${article.slug}`,
    },
    ...(article.image && {
      image: {
        "@type": "ImageObject",
        url: `${SITE_URL}${article.image}`,
        width: 1200,
        height: 630,
      },
    }),
  };
}

export function jsonLdFAQ(faqs: FAQ[]) {
  if (!faqs?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.reponse,
      },
    })),
  };
}

export function jsonLdProduct(produit: Produit) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: produit.nom,
    description: produit.description,
    image: produit.images.map((img) => `${SITE_URL}${img}`),
    ...(produit.note && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: String(produit.note),
        bestRating: "5",
        worstRating: "1",
        reviewCount: String(produit.nombreAvis ?? 1),
      },
    }),
    ...(produit.prixIndicatif && {
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "EUR",
        lowPrice: produit.prixIndicatif,
        highPrice: produit.prixAvant ?? produit.prixIndicatif,
        offerCount: produit.liensAffilies.length,
        availability: "https://schema.org/InStock",
      },
    }),
  };
}

export function jsonLdBreadcrumb(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function jsonLdItemList(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: `${SITE_URL}${item.url}`,
    })),
  };
}

export { SITE_URL, SITE_NAME, SITE_DESCRIPTION };

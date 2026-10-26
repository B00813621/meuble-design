import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles, getAllProduits } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Recherche | Meuble Design",
  description: "Recherchez des meubles, guides d'achat et articles sur Meuble Design.",
  robots: { index: false, follow: true },
};

const TYPE_PATHS = { article: "blog", guide: "guides", comparatif: "comparatifs" } as const;

export default async function RecherchePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.toLowerCase().trim();

  const articles = query.length > 1
    ? getAllArticles().filter(
        (a) =>
          a.titre.toLowerCase().includes(query) ||
          a.metaDescription.toLowerCase().includes(query) ||
          a.tags?.some((t) => t.toLowerCase().includes(query))
      )
    : [];

  const produits = query.length > 1
    ? getAllProduits().filter(
        (p) =>
          p.nom.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.categorie.toLowerCase().includes(query)
      )
    : [];

  const total = articles.length + produits.length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 font-serif text-3xl font-bold text-stone-900">Résultats de recherche</h1>

      {query && (
        <p className="mb-8 text-stone-500">
          {total} résultat{total !== 1 ? "s" : ""} pour «&nbsp;
          <strong className="text-stone-800">{q}</strong>&nbsp;»
        </p>
      )}

      {!query && (
        <p className="mt-4 text-stone-500">
          Entrez un terme dans la barre de recherche pour trouver des meubles, guides ou articles.
        </p>
      )}

      {query && total === 0 && (
        <div className="mt-8 rounded-2xl border border-stone-100 bg-stone-50 p-8 text-center">
          <p className="text-stone-500">Aucun résultat pour «&nbsp;{q}&nbsp;».</p>
          <p className="mt-2 text-sm text-stone-400">
            Essayez un terme plus général ou parcourez nos{" "}
            <Link href="/boutique" className="text-brand-700 hover:underline">
              catégories
            </Link>
            .
          </p>
        </div>
      )}

      {produits.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-600">
            Produits ({produits.length})
          </h2>
          <div className="space-y-2">
            {produits.map((p) => (
              <Link
                key={p.slug}
                href={`/produits/${p.slug}`}
                className="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-5 py-4 transition hover:border-brand-300 hover:shadow-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-stone-900">{p.nom}</p>
                  <p className="truncate text-sm text-stone-500">{p.description}</p>
                </div>
                {p.prixIndicatif && (
                  <span className="ml-4 shrink-0 font-semibold text-brand-700">
                    {p.prixIndicatif}&nbsp;€
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {articles.length > 0 && (
        <section>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-600">
            Articles &amp; guides ({articles.length})
          </h2>
          <div className="space-y-2">
            {articles.map((a) => (
              <Link
                key={a.slug}
                href={`/${TYPE_PATHS[a.type]}/${a.slug}`}
                className="block rounded-xl border border-stone-200 bg-white px-5 py-4 transition hover:border-brand-300 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-stone-900">{a.titre}</p>
                    <p className="mt-0.5 text-sm text-stone-500 line-clamp-1">{a.metaDescription}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium capitalize text-stone-500">
                    {a.type}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

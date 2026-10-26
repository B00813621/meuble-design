import Link from "next/link";
import { getAllArticles, getAllProduits } from "@/lib/content";
import { ArticleCard } from "@/components/ArticleCard";
import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { PromoCarousel } from "@/components/PromoCarousel";

const TYPES_PRODUITS = [
  { slug: "canapes",        label: "Canapés",          emoji: "🛋️",  bg: "bg-amber-50" },
  { slug: "lampes",         label: "Lampes",           emoji: "💡",  bg: "bg-yellow-50" },
  { slug: "lampes-chevet",  label: "Lampes de chevet", emoji: "🌙",  bg: "bg-indigo-50" },
  { slug: "chaises",        label: "Chaises",          emoji: "🪑",  bg: "bg-stone-100" },
  { slug: "tables",         label: "Tables",           emoji: "🪵",  bg: "bg-orange-50" },
];

const ZONES = [
  { slug: "salon",         label: "Salon",         emoji: "🛋️",  desc: "Canapés, tables, luminaires" },
  { slug: "cuisine",       label: "Cuisine",       emoji: "🍽️",  desc: "Tables, chaises, rangements" },
  { slug: "chambre",       label: "Chambre",       emoji: "🛏️",  desc: "Lits, chevets, armoires" },
  { slug: "bureau",        label: "Bureau",        emoji: "💻",  desc: "Bureaux, chaises ergonomiques" },
  { slug: "exterieur",     label: "Extérieur",     emoji: "🌿",  desc: "Mobilier de jardin, terrasse" },
  { slug: "salle-de-bain", label: "Salle de bain", emoji: "🚿",  desc: "Miroirs, meubles vasque" },
];

function SectionHeader({
  label,
  title,
  href,
  hrefLabel = "Voir tout →",
}: {
  label?: string;
  title: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="mb-8 flex items-end justify-between border-b border-stone-200 pb-4">
      <div>
        {label && (
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-brand-600">{label}</p>
        )}
        <h2 className="font-serif text-2xl font-bold text-stone-900">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="shrink-0 text-sm font-medium text-stone-400 transition hover:text-brand-700">
          {hrefLabel}
        </Link>
      )}
    </div>
  );
}

export default async function HomePage() {
  const tousProduits = getAllProduits();
  const produitsPromo = tousProduits.filter((p) => p.promotionPourcent && p.promotionPourcent > 0);
  const topVentes = tousProduits.filter((p) => !p.promotionPourcent).slice(0, 3);
  const articles = getAllArticles().slice(0, 3);

  return (
    <div className="bg-white">

      {/* ── 1. Recherche ── */}
      <section className="px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-serif text-4xl font-bold leading-tight text-stone-900 sm:text-5xl">
            Trouvez vos meubles
            <span className="block text-brand-700">au meilleur prix</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-stone-500">
            Fiches produits, guides d'achat et meilleures offres — tout pour décorer avec style.
          </p>
          <div className="mt-8">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* ── 2. Types de meubles ── */}
      <section className="border-t border-stone-100 bg-stone-50 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader title="Types de meubles" href="/boutique" hrefLabel="Tous les produits →" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {TYPES_PRODUITS.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className={`group flex flex-col items-center justify-center gap-2 rounded-2xl ${cat.bg} px-3 py-7 text-center transition hover:ring-2 hover:ring-brand-300`}
              >
                <span className="text-4xl" role="img" aria-hidden="true">{cat.emoji}</span>
                <span className="text-sm font-semibold leading-tight text-stone-700 group-hover:text-brand-700">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Par pièce ── */}
      <section className="border-t border-stone-100 bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader title="Par pièce de la maison" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {ZONES.map((zone) => (
              <Link
                key={zone.slug}
                href={`/categories/${zone.slug}`}
                className="group flex flex-col items-start gap-2 rounded-2xl border border-stone-200 bg-white p-5 transition hover:border-brand-300 hover:shadow-sm"
              >
                <span className="text-3xl" role="img" aria-hidden="true">{zone.emoji}</span>
                <div>
                  <p className="font-semibold text-stone-800 group-hover:text-brand-700">{zone.label}</p>
                  <p className="mt-0.5 text-xs text-stone-400">{zone.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Meilleures ventes ── */}
      <section className="border-t border-stone-100 bg-stone-50 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader label="Sélection" title="Meilleures ventes" href="/boutique" />
          {topVentes.length === 0 ? (
            <p className="py-12 text-center text-stone-400">Produits bientôt disponibles</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {topVentes.map((produit, i) => (
                <ProductCard key={produit.slug} produit={produit} priority={i === 0} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 5. Promotions ── */}
      {produitsPromo.length > 0 && (
        <section className="border-t border-stone-100 bg-amber-50/50 px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-end justify-between border-b border-amber-200/60 pb-4">
              <div>
                <span className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-brand-700 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Offres limitées
                </span>
                <h2 className="mt-1 font-serif text-2xl font-bold text-stone-900">
                  Meilleures promotions
                </h2>
              </div>
              <Link href="/boutique" className="shrink-0 text-sm font-medium text-stone-400 transition hover:text-brand-700">
                Voir tout →
              </Link>
            </div>
            <PromoCarousel produits={produitsPromo} />
          </div>
        </section>
      )}

      {/* ── 6. Articles ── */}
      <section className="border-t border-stone-100 bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader label="Blog & Guides" title="Nos articles" href="/guides" hrefLabel="Tous les articles →" />
          {articles.length === 0 ? (
            <p className="py-12 text-center text-stone-400">Articles bientôt disponibles</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-3">
              {articles.map((article, i) => (
                <ArticleCard key={article.slug} article={article} priority={i === 0} />
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}

import type { Metadata } from "next";
import { getAllArticles } from "@/lib/content";
import { ArticleCard } from "@/components/ArticleCard";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Comparatifs meubles design",
  description: "Comparatifs détaillés de meubles design : tableaux, notes, prix et avis pour choisir le meilleur rapport qualité-prix.",
  path: "/comparatifs",
});

export default function ComparatifsPage() {
  const comparatifs = getAllArticles("comparatif");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="font-serif text-3xl font-bold text-stone-900 sm:text-4xl">Comparatifs</h1>
        <p className="mt-3 max-w-2xl text-stone-600">
          Des tableaux comparatifs objectifs pour trouver le meilleur meuble design selon votre budget.
        </p>
      </header>

      {comparatifs.length === 0 ? (
        <p className="text-stone-500">Aucun comparatif pour le moment. Revenez bientôt !</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {comparatifs.map((c, i) => (
            <ArticleCard key={c.slug} article={c} priority={i < 2} />
          ))}
        </div>
      )}
    </div>
  );
}

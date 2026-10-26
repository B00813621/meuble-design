import type { Metadata } from "next";
import { getAllProduits } from "@/lib/content";
import { BoutiqueGrid } from "@/components/BoutiqueGrid";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Boutique — Meubles design",
  description: "Fiches produits meubles design avec photos, dimensions, matériaux et liens vers les meilleures offres.",
  path: "/boutique",
});

export default function BoutiquePage() {
  const produits = getAllProduits();

  return (
    <>
      <div className="border-b border-stone-100 bg-white px-4 pb-6 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">Boutique</p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-stone-900 sm:text-4xl">
            Tous nos meubles design
          </h1>
          <p className="mt-2 text-stone-500">
            Sélectionnez un ou plusieurs filtres pour affiner votre recherche.
          </p>
        </div>
      </div>
      <BoutiqueGrid produits={produits} />
    </>
  );
}

"use client";

import { useState, useMemo } from "react";
import type { Produit } from "@/types";
import { ProductCard } from "./ProductCard";

const FILTRES_TYPES = [
  { slug: "canapes",        label: "Canapés" },
  { slug: "lampes",         label: "Lampes" },
  { slug: "lampes-chevet",  label: "Lampes de chevet" },
  { slug: "chaises",        label: "Chaises" },
  { slug: "tables",         label: "Tables" },
];

const FILTRES_ZONES = [
  { slug: "salon",          label: "Salon" },
  { slug: "bureau",         label: "Bureau" },
  { slug: "chambre",        label: "Chambre" },
  { slug: "cuisine",        label: "Cuisine" },
  { slug: "exterieur",      label: "Extérieur" },
  { slug: "salle-de-bain",  label: "Salle de bain" },
];

interface Props {
  produits: Produit[];
  initialFiltres?: string[];
}

export function BoutiqueGrid({ produits, initialFiltres = [] }: Props) {
  const [actifs, setActifs] = useState<Set<string>>(new Set(initialFiltres));

  function toggle(slug: string) {
    setActifs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function reset() {
    setActifs(new Set());
  }

  const produitsFiltres = useMemo(() => {
    if (actifs.size === 0) return produits;
    return produits.filter((p) => actifs.has(p.categorie));
  }, [produits, actifs]);

  const hasActifs = actifs.size > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

      {/* Filtres Types */}
      <div className="mb-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-stone-400">
          Type de meuble
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {FILTRES_TYPES.map((f) => {
            const isActive = actifs.has(f.slug);
            return (
              <button
                key={f.slug}
                onClick={() => toggle(f.slug)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-brand-700 text-white shadow-sm"
                    : "border border-stone-200 bg-white text-stone-600 hover:border-brand-300 hover:text-brand-700"
                }`}
                aria-pressed={isActive}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filtres Zones */}
      <div className="mb-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-stone-400">
          Pièce de la maison
        </p>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {FILTRES_ZONES.map((f) => {
              const isActive = actifs.has(f.slug);
              return (
                <button
                  key={f.slug}
                  onClick={() => toggle(f.slug)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-stone-800 text-white shadow-sm"
                      : "border border-stone-200 bg-white text-stone-600 hover:border-stone-400 hover:text-stone-800"
                  }`}
                  aria-pressed={isActive}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Effacer */}
          <button
            onClick={reset}
            className={`text-sm transition ${
              hasActifs
                ? "cursor-pointer text-stone-400 hover:text-brand-700"
                : "pointer-events-none text-stone-200"
            }`}
            aria-disabled={!hasActifs}
          >
            Effacer les filtres
          </button>
        </div>
      </div>

      {/* Compteur */}
      <p className="mb-6 text-sm text-stone-400">
        {produitsFiltres.length} produit{produitsFiltres.length !== 1 ? "s" : ""}
        {hasActifs && (
          <span>
            {" "}· filtré{produitsFiltres.length !== 1 ? "s" : ""} sur{" "}
            {[...actifs].map((s) => {
              const f = [...FILTRES_TYPES, ...FILTRES_ZONES].find((x) => x.slug === s);
              return f?.label ?? s;
            }).join(", ")}
          </span>
        )}
      </p>

      {/* Grille */}
      {produitsFiltres.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-200 py-20 text-center">
          <p className="text-stone-400">Aucun produit pour cette sélection.</p>
          <button onClick={reset} className="mt-3 text-sm font-medium text-brand-700 hover:underline">
            Voir tous les produits
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {produitsFiltres.map((produit, i) => (
            <ProductCard key={produit.slug} produit={produit} priority={i < 3} />
          ))}
        </div>
      )}
    </div>
  );
}

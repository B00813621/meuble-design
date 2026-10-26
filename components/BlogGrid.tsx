"use client";

import { useState, useMemo } from "react";
import type { Article } from "@/types";
import { ArticleCard } from "./ArticleCard";

const FILTRES = [
  { slug: "tous",       label: "Tous" },
  { slug: "article",    label: "Articles déco" },
  { slug: "guide",      label: "Guides d'achat" },
  { slug: "comparatif", label: "Comparatifs" },
];

interface Props {
  articles: Article[];
  initialFiltre?: string;
}

export function BlogGrid({ articles, initialFiltre = "tous" }: Props) {
  const [actif, setActif] = useState(initialFiltre);

  const articlesFiltres = useMemo(() => {
    if (actif === "tous") return articles;
    return articles.filter((a) => a.type === actif);
  }, [articles, actif]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

      {/* Barre de navigation */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Filtrer les articles" className="flex flex-wrap gap-2">
          {FILTRES.map((f) => {
            const isActive = actif === f.slug;
            const count = f.slug === "tous"
              ? articles.length
              : articles.filter((a) => a.type === f.slug).length;

            return (
              <button
                key={f.slug}
                onClick={() => setActif(f.slug)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-brand-700 text-white shadow-sm"
                    : "border border-stone-200 bg-white text-stone-600 hover:border-brand-300 hover:text-brand-700"
                }`}
                aria-pressed={isActive}
              >
                {f.label}
                <span className={`ml-1.5 text-xs ${isActive ? "text-brand-200" : "text-stone-400"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Effacer */}
        <button
          onClick={() => setActif("tous")}
          className={`text-sm transition ${
            actif !== "tous"
              ? "cursor-pointer text-stone-400 hover:text-brand-700"
              : "pointer-events-none text-stone-200"
          }`}
          aria-disabled={actif === "tous"}
        >
          Effacer
        </button>
      </div>

      {/* Compteur */}
      <p className="mb-6 text-sm text-stone-400">
        {articlesFiltres.length} article{articlesFiltres.length !== 1 ? "s" : ""}
      </p>

      {articlesFiltres.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-200 py-20 text-center">
          <p className="text-stone-400">Aucun article dans cette catégorie.</p>
          <button onClick={() => setActif("tous")} className="mt-3 text-sm font-medium text-brand-700 hover:underline">
            Voir tous les articles
          </button>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articlesFiltres.map((article, i) => (
            <ArticleCard key={article.slug} article={article} priority={i < 2} />
          ))}
        </div>
      )}
    </div>
  );
}

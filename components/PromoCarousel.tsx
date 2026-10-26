"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Produit } from "@/types";

interface Props {
  produits: Produit[];
}

export function PromoCarousel({ produits }: Props) {
  const [current, setCurrent] = useState(0);
  const dragStart = useRef(0);
  const total = produits.length;

  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);

  function onDragStart(e: React.MouseEvent | React.TouchEvent) {
    dragStart.current = "touches" in e ? e.touches[0].clientX : e.clientX;
  }
  function onDragEnd(e: React.MouseEvent | React.TouchEvent) {
    const end = "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
    const delta = dragStart.current - end;
    if (Math.abs(delta) > 40) delta > 0 ? next() : prev();
  }

  return (
    <div className="relative px-8">
      {/* Track */}
      <div
        className="overflow-hidden"
        onMouseDown={onDragStart}
        onMouseUp={onDragEnd}
        onTouchStart={onDragStart}
        onTouchEnd={onDragEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(calc(${current} * (-100% / 4)))` }}
        >
          {produits.map((produit) => (
            <div key={produit.slug} className="w-1/2 shrink-0 px-2 sm:w-1/3 lg:w-1/4">
              <Link
                href={`/produits/${produit.slug}`}
                className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-100 transition hover:shadow-md hover:ring-brand-200"
              >
                {/* Photo */}
                <div className="relative aspect-square overflow-hidden bg-stone-50">
                  {produit.images[0] ? (
                    <Image
                      src={produit.images[0]}
                      alt={produit.nom}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-stone-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {/* Badge % */}
                  {produit.promotionPourcent && (
                    <span className="absolute right-2 top-2 rounded-full bg-brand-700 px-2 py-0.5 text-xs font-bold text-white">
                      -{produit.promotionPourcent}%
                    </span>
                  )}
                </div>

                {/* Nom + prix */}
                <div className="px-3 py-3">
                  <p className="truncate text-sm font-semibold text-stone-800 group-hover:text-brand-700">
                    {produit.nom}
                  </p>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    {produit.prixIndicatif && (
                      <span className="text-sm font-bold text-brand-700">
                        {produit.prixIndicatif} €
                      </span>
                    )}
                    {produit.prixAvant && (
                      <span className="text-xs text-stone-400 line-through">
                        {produit.prixAvant} €
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Flèche gauche */}
      <button
        onClick={prev}
        aria-label="Précédent"
        className="absolute -left-1 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2.5 shadow-md ring-1 ring-stone-100 transition hover:bg-brand-50 hover:ring-brand-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Flèche droite */}
      <button
        onClick={next}
        aria-label="Suivant"
        className="absolute -right-1 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2.5 shadow-md ring-1 ring-stone-100 transition hover:bg-brand-50 hover:ring-brand-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="mt-5 flex justify-center gap-1.5">
        {produits.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Produit ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current ? "w-5 bg-brand-700" : "w-1.5 bg-stone-300 hover:bg-stone-400"
            } h-1.5`}
          />
        ))}
      </div>
    </div>
  );
}

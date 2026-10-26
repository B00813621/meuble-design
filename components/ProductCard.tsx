import Image from "next/image";
import Link from "next/link";
import type { Produit } from "@/types";
import { AffiliateButton } from "./AffiliateButton";

interface Props {
  produit: Produit;
  priority?: boolean;
  showPromo?: boolean;
}

export function ProductCard({ produit, priority, showPromo = true }: Props) {
  const image = produit.images[0];
  const premierLien = produit.liensAffilies[0];
  const hasPromo = showPromo && produit.promotionPourcent && produit.prixAvant;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md">
      {/* Photo */}
      <Link href={`/produits/${produit.slug}`} className="relative block overflow-hidden">
        <div className="relative aspect-[4/3] bg-stone-100">
          {image ? (
            <Image
              src={image}
              alt={produit.nom}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition duration-300 group-hover:scale-105"
              priority={priority}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-stone-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Badge promo */}
        {hasPromo && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white shadow">
            -{produit.promotionPourcent}%
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Catégorie + nom */}
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-brand-500">
            {produit.categorie}
          </span>
          <h3 className="mt-0.5 font-serif text-lg font-semibold leading-snug text-stone-900">
            <Link href={`/produits/${produit.slug}`} className="hover:text-brand-700">
              {produit.nom}
            </Link>
          </h3>

          {/* Prix */}
          <div className="mt-1 flex items-baseline gap-2">
            {produit.prixIndicatif && (
              <span className="font-semibold text-brand-700">
                {produit.prixIndicatif} €
              </span>
            )}
            {hasPromo && produit.prixAvant && (
              <span className="text-sm text-stone-400 line-through">
                {produit.prixAvant} €
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="line-clamp-2 text-sm leading-relaxed text-stone-500">
          {produit.description}
        </p>

        {/* Dimensions & matériaux */}
        {(produit.dimensions || produit.materiaux) && (
          <ul className="space-y-1 border-t border-stone-100 pt-3 text-xs text-stone-400">
            {produit.dimensions && (
              <li className="flex gap-2">
                <span className="w-20 shrink-0 font-medium text-stone-400">Dimensions</span>
                <span>{produit.dimensions}</span>
              </li>
            )}
            {produit.materiaux && (
              <li className="flex gap-2">
                <span className="w-20 shrink-0 font-medium text-stone-400">Matériaux</span>
                <span>{produit.materiaux}</span>
              </li>
            )}
          </ul>
        )}

        {/* Bouton affilié */}
        {premierLien && (
          <div className="mt-auto pt-2">
            <AffiliateButton lien={premierLien} campaign={produit.slug} />
          </div>
        )}

        <Link
          href={`/produits/${produit.slug}`}
          className="text-center text-xs text-stone-400 hover:text-brand-700 hover:underline"
        >
          Voir toutes les offres →
        </Link>
      </div>
    </article>
  );
}

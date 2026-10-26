import Link from "next/link";
import Image from "next/image";
import type { Categorie } from "@/types";

interface Props {
  categories: Categorie[];
}

export function CategoryGrid({ categories }: Props) {
  return (
    <section aria-label="Catégories de meubles">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-stone-100 p-6 text-center transition hover:bg-brand-50"
          >
            {cat.image && (
              <div className="relative mb-3 h-16 w-16 overflow-hidden rounded-full">
                <Image
                  src={cat.image}
                  alt={cat.nom}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            )}
            <span className="font-serif text-base font-semibold text-stone-800 group-hover:text-brand-700">
              {cat.nom}
            </span>
            <span className="mt-0.5 text-xs text-stone-500">{cat.description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

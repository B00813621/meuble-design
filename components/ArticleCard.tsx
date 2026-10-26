import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/types";

const TYPE_LABELS = {
  article: "Article",
  guide: "Guide d'achat",
  comparatif: "Comparatif",
};

const TYPE_PATHS = {
  article: "blog",
  guide: "guides",
  comparatif: "comparatifs",
};

interface Props {
  article: Article;
  priority?: boolean;
}

export function ArticleCard({ article, priority }: Props) {
  const href = `/${TYPE_PATHS[article.type]}/${article.slug}`;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md">
      {article.image && (
        <Link href={href} className="block overflow-hidden">
          <div className="relative aspect-[16/9] bg-stone-100">
            <Image
              src={article.image}
              alt={article.imageAlt ?? article.titre}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition duration-300 group-hover:scale-105"
              priority={priority}
            />
          </div>
        </Link>
      )}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
            {TYPE_LABELS[article.type]}
          </span>
          {article.tempsLecture && (
            <span className="text-xs text-stone-400">{article.tempsLecture} min de lecture</span>
          )}
        </div>
        <h3 className="font-serif text-lg font-semibold leading-snug text-stone-900">
          <Link href={href} className="hover:text-brand-700">
            {article.titre}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-stone-600">{article.metaDescription}</p>
        <time
          dateTime={article.datePublication}
          className="mt-auto pt-2 text-xs text-stone-400"
        >
          {new Date(article.datePublication).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </time>
      </div>
    </article>
  );
}

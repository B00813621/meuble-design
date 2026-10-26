"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

type Article = {
  slug: string;
  type: "article" | "guide" | "comparatif";
  titre: string;
  metaDescription: string;
  datePublication: string;
  dateMaj: string;
  auteur?: string;
  contientLiensAffilies: boolean;
  tags: string[];
};

const TYPE_LABEL = { article: "Article", guide: "Guide", comparatif: "Comparatif" };
const TYPE_COLOR = {
  article: "bg-blue-50 text-blue-700",
  guide: "bg-green-50 text-green-700",
  comparatif: "bg-purple-50 text-purple-700",
};
const TYPE_PATH = { article: "blog", guide: "guides", comparatif: "comparatifs" };

function ArticleList() {
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(searchParams.get("type") ?? "all");
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/articles")
      .then((r) => r.json())
      .then((data) => { setArticles(data); setLoading(false); });
  }, []);

  const visible = articles.filter((a) => {
    if (filter !== "all" && a.type !== filter) return false;
    if (search && !a.titre.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  async function handleDelete(type: string, slug: string) {
    if (!confirm(`Supprimer "${slug}" ? Cette action est irréversible.`)) return;
    setDeleting(`${type}/${slug}`);
    await fetch(`/api/admin/articles/${type}/${slug}`, { method: "DELETE" });
    setArticles((prev) => prev.filter((a) => !(a.type === type && a.slug === slug)));
    setDeleting(null);
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Articles & Contenus</h1>
          <p className="mt-0.5 text-sm text-stone-400">{articles.length} contenus publiés</p>
        </div>
        <Link
          href="/admin/articles/nouveau"
          className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-700"
        >
          + Nouvel article
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-56 rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-stone-400"
        />
        {["all", "article", "guide", "comparatif"].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              filter === t ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            {t === "all" ? "Tous" : TYPE_LABEL[t as keyof typeof TYPE_LABEL]}
            {t !== "all" && ` (${articles.filter((a) => a.type === t).length})`}
          </button>
        ))}
      </div>

      {loading && (
        <div className="py-16 text-center text-stone-400">Chargement...</div>
      )}

      {!loading && visible.length === 0 && (
        <div className="py-16 text-center text-stone-400">Aucun résultat</div>
      )}

      {!loading && visible.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-stone-100 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 text-left text-xs font-semibold uppercase tracking-wide text-stone-400">
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Titre</th>
                <th className="hidden px-4 py-3 md:table-cell">Auteur</th>
                <th className="hidden px-4 py-3 lg:table-cell">Publication</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((a, i) => (
                <tr
                  key={`${a.type}/${a.slug}`}
                  className={`${i > 0 ? "border-t border-stone-50" : ""} hover:bg-stone-50`}
                >
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${TYPE_COLOR[a.type]}`}>
                      {TYPE_LABEL[a.type]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-stone-900">{a.titre}</p>
                    <p className="mt-0.5 max-w-md truncate text-xs text-stone-400">{a.metaDescription}</p>
                    {a.tags.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {a.tags.slice(0, 3).map((t) => (
                          <span key={t} className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] text-stone-500">{t}</span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 text-stone-500 md:table-cell">{a.auteur ?? "—"}</td>
                  <td className="hidden px-4 py-3 text-stone-400 lg:table-cell">
                    {new Date(a.datePublication).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/articles/${a.type}/${a.slug}`}
                        className="rounded-md border border-stone-200 px-2.5 py-1 text-xs font-medium text-stone-600 transition hover:bg-stone-100"
                      >
                        Modifier
                      </Link>
                      <a
                        href={`/${TYPE_PATH[a.type]}/${a.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md border border-stone-200 px-2.5 py-1 text-xs font-medium text-stone-600 transition hover:bg-stone-100"
                      >
                        Voir
                      </a>
                      <button
                        onClick={() => handleDelete(a.type, a.slug)}
                        disabled={deleting === `${a.type}/${a.slug}`}
                        className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        {deleting === `${a.type}/${a.slug}` ? "..." : "Suppr."}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function ArticlesPage() {
  return (
    <Suspense>
      <ArticleList />
    </Suspense>
  );
}

import Link from "next/link";
import { listAllContent } from "@/lib/admin";
import { getAllProduits } from "@/lib/content";

export const dynamic = "force-dynamic";

export default function AdminDashboard() {
  const articles = listAllContent();
  const produits = getAllProduits();

  const byType = {
    article: articles.filter((a) => a.type === "article"),
    guide: articles.filter((a) => a.type === "guide"),
    comparatif: articles.filter((a) => a.type === "comparatif"),
  };

  const withAffil = articles.filter((a) => a.contientLiensAffilies);
  const recent = articles.slice(0, 5);

  return (
    <div className="p-8">
      <h1 className="mb-1 text-2xl font-bold text-stone-900">Dashboard</h1>
      <p className="mb-8 text-sm text-stone-400">Vue d'ensemble du contenu du site</p>

      {/* Stats */}
      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Articles", count: byType.article.length, href: "/admin/articles?type=article", color: "bg-blue-50 text-blue-700" },
          { label: "Guides", count: byType.guide.length, href: "/admin/articles?type=guide", color: "bg-green-50 text-green-700" },
          { label: "Comparatifs", count: byType.comparatif.length, href: "/admin/articles?type=comparatif", color: "bg-purple-50 text-purple-700" },
          { label: "Produits", count: produits.length, href: "/boutique", color: "bg-amber-50 text-amber-700" },
        ].map(({ label, count, href, color }) => (
          <Link
            key={label}
            href={href}
            className="group flex flex-col gap-1 rounded-2xl border border-stone-100 bg-white p-5 transition hover:border-stone-200 hover:shadow-sm"
          >
            <span className={`w-fit rounded-full px-2 py-0.5 text-xs font-semibold ${color}`}>
              {label}
            </span>
            <span className="mt-2 text-4xl font-bold text-stone-900">{count}</span>
            <span className="text-xs text-stone-400 group-hover:text-stone-600">
              Voir →
            </span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent articles */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-stone-900">Derniers contenus publiés</h2>
            <Link href="/admin/articles" className="text-xs text-brand-700 hover:underline">
              Voir tout →
            </Link>
          </div>
          <div className="overflow-hidden rounded-xl border border-stone-100 bg-white">
            {recent.map((a, i) => (
              <div key={`${a.type}/${a.slug}`} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t border-stone-50" : ""}`}>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                  a.type === "article" ? "bg-blue-50 text-blue-600" :
                  a.type === "guide" ? "bg-green-50 text-green-600" :
                  "bg-purple-50 text-purple-600"
                }`}>
                  {a.type}
                </span>
                <Link
                  href={`/admin/articles/${a.type}/${a.slug}`}
                  className="min-w-0 flex-1 truncate text-sm font-medium text-stone-800 hover:text-brand-700"
                >
                  {a.titre}
                </Link>
                <span className="shrink-0 text-xs text-stone-400">
                  {new Date(a.datePublication).toLocaleDateString("fr-FR")}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Quick actions */}
        <section>
          <h2 className="mb-3 font-semibold text-stone-900">Actions rapides</h2>
          <div className="space-y-2">
            {[
              { href: "/admin/articles/nouveau", label: "Rédiger un nouvel article", desc: "Créer un article, guide ou comparatif", icon: "✏️" },
              { href: "/admin/images", label: "Bibliothèque d'images", desc: `Gérer et uploader des visuels`, icon: "🖼️" },
              { href: "/", label: "Voir le site en live", desc: "Ouvre le site dans le navigateur", icon: "🌐" },
            ].map(({ href, label, desc, icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-4 rounded-xl border border-stone-100 bg-white px-4 py-3 transition hover:border-stone-200 hover:shadow-sm"
              >
                <span className="text-xl">{icon}</span>
                <div>
                  <p className="text-sm font-medium text-stone-900">{label}</p>
                  <p className="text-xs text-stone-400">{desc}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
            <strong>💡 Workflow :</strong> modifiez vos articles ici, puis lancez{" "}
            <code className="rounded bg-amber-100 px-1 font-mono text-xs">git push</code>{" "}
            dans le terminal pour déployer sur Vercel automatiquement.
          </div>

          <div className="mt-3 text-xs text-stone-400">
            Articles avec liens affiliés : <strong>{withAffil.length}</strong> / {articles.length}
          </div>
        </section>
      </div>
    </div>
  );
}

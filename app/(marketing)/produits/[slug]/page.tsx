import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { getProduitBySlug, getAllProduits } from "@/lib/content";
import { buildMetadata, jsonLdProduct, jsonLdBreadcrumb } from "@/lib/seo";
import { AffiliateButton } from "@/components/AffiliateButton";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { Breadcrumb } from "@/components/Breadcrumb";
import { getMarchandLabel } from "@/lib/affiliate";

export async function generateStaticParams() {
  return getAllProduits().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const produit = getProduitBySlug(slug);
  if (!produit) return {};
  return buildMetadata({
    title: produit.nom,
    description: produit.description,
    path: `/produits/${slug}`,
    image: produit.images[0],
  });
}

export default async function ProduitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const produit = getProduitBySlug(slug);
  if (!produit) notFound();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProduct(produit)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb([
        { name: "Accueil", url: "/" },
        { name: produit.categorie, url: `/categories/${produit.categorie}` },
        { name: produit.nom, url: `/produits/${slug}` },
      ])) }} />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumb items={[
          { label: produit.categorie, href: `/categories/${produit.categorie}` },
          { label: produit.nom },
        ]} />

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Images */}
          <div className="space-y-4">
            {produit.images[0] && (
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-stone-100">
                <Image
                  src={produit.images[0]}
                  alt={produit.nom}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            )}
            {produit.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {produit.images.slice(1, 5).map((img, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden rounded-lg bg-stone-100">
                    <Image src={img} alt={`${produit.nom} — vue ${i + 2}`} fill className="object-cover" sizes="25vw" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Infos */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                {produit.categorie}
              </span>
              <h1 className="mt-1 font-serif text-3xl font-bold text-stone-900">{produit.nom}</h1>
              {produit.prixIndicatif && (
                <p className="mt-2 text-2xl font-semibold text-stone-800">
                  À partir de {produit.prixIndicatif} €
                </p>
              )}
            </div>

            <p className="text-stone-600 leading-relaxed">{produit.description}</p>

            {(produit.dimensions || produit.materiaux) && (
              <dl className="divide-y divide-stone-100 rounded-xl border border-stone-200 text-sm">
                {produit.dimensions && (
                  <div className="flex gap-4 px-4 py-3">
                    <dt className="w-32 shrink-0 font-medium text-stone-500">Dimensions</dt>
                    <dd className="text-stone-800">{produit.dimensions}</dd>
                  </div>
                )}
                {produit.materiaux && (
                  <div className="flex gap-4 px-4 py-3">
                    <dt className="w-32 shrink-0 font-medium text-stone-500">Matériaux</dt>
                    <dd className="text-stone-800">{produit.materiaux}</dd>
                  </div>
                )}
              </dl>
            )}

            <AffiliateDisclosure />

            {/* Liens affiliés */}
            <div className="space-y-3">
              <h2 className="font-semibold text-stone-800">Voir les offres</h2>
              {produit.liensAffilies.map((lien) => (
                <div key={lien.marchand} className="flex items-center justify-between rounded-xl border border-stone-200 px-4 py-3">
                  <span className="font-medium text-stone-700">{getMarchandLabel(lien.marchand)}</span>
                  <div className="flex items-center gap-3">
                    {lien.prixAffiche && (
                      <span className="font-semibold text-stone-800">{lien.prixAffiche}</span>
                    )}
                    <AffiliateButton lien={lien} campaign={produit.slug} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

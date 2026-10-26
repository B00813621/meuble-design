import type { Metadata } from "next";
import { getAllProduits } from "@/lib/content";
import { buildMetadata, jsonLdBreadcrumb } from "@/lib/seo";
import { BoutiqueGrid } from "@/components/BoutiqueGrid";

const CATEGORIES: Record<string, { nom: string; description: string }> = {
  canapes:         { nom: "Canapés",           description: "Canapés et fauteuils design pour un salon élégant." },
  lampes:          { nom: "Lampes",            description: "Lampes, suspensions et luminaires design." },
  "lampes-chevet": { nom: "Lampes de chevet",  description: "Lampes de chevet design pour votre chambre." },
  chaises:         { nom: "Chaises",           description: "Chaises et tabourets design pour chaque pièce." },
  tables:          { nom: "Tables",            description: "Tables basses, à manger et de bureau design." },
  salon:           { nom: "Salon",             description: "Canapés, fauteuils, tables basses et meubles TV design." },
  bureau:          { nom: "Bureau",            description: "Chaises ergonomiques, bureaux et rangements design." },
  chambre:         { nom: "Chambre",           description: "Lits, chevets, armoires et commodes design." },
  cuisine:         { nom: "Cuisine",           description: "Tables, chaises et rangements design pour la cuisine." },
  exterieur:       { nom: "Extérieur",         description: "Mobilier de jardin et de terrasse design." },
  "salle-de-bain": { nom: "Salle de bain",     description: "Miroirs, meubles vasque et accessoires design." },
  luminaire:       { nom: "Luminaires",        description: "Lampes, suspensions et appliques design." },
  "salle-a-manger":{ nom: "Salle à manger",    description: "Tables et chaises design pour vos repas." },
  jardin:          { nom: "Extérieur & Jardin", description: "Mobilier outdoor design pour l'extérieur." },
};

export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORIES[slug];
  if (!cat) return {};
  return buildMetadata({
    title: `${cat.nom} — Meubles design`,
    description: cat.description,
    path: `/categories/${slug}`,
  });
}

export default async function CategoriePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = CATEGORIES[slug];
  const produits = getAllProduits();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            jsonLdBreadcrumb([
              { name: "Accueil", url: "/" },
              { name: "Boutique", url: "/boutique" },
              { name: cat?.nom ?? slug, url: `/categories/${slug}` },
            ])
          ),
        }}
      />

      <div className="border-b border-stone-100 bg-white px-4 pb-6 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <nav aria-label="Fil d'Ariane" className="mb-3 flex items-center gap-1.5 text-sm text-stone-400">
            <a href="/" className="hover:text-brand-700">Accueil</a>
            <span aria-hidden>›</span>
            <a href="/boutique" className="hover:text-brand-700">Boutique</a>
            <span aria-hidden>›</span>
            <span className="font-medium text-stone-700">{cat?.nom ?? slug}</span>
          </nav>
          <h1 className="font-serif text-3xl font-bold text-stone-900 sm:text-4xl">
            {cat?.nom ?? slug}
          </h1>
          {cat && <p className="mt-2 text-stone-500">{cat.description}</p>}
        </div>
      </div>

      {/* Tous les produits + filtre pré-sélectionné */}
      <BoutiqueGrid produits={produits} initialFiltres={[slug]} />
    </>
  );
}

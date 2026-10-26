import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Mentions légales",
  description: "Mentions légales du site MeubleDesign.fr — éditeur, hébergeur et informations légales obligatoires.",
  path: "/mentions-legales",
});

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-bold text-stone-900">Mentions légales</h1>
      <p className="mt-2 text-sm text-stone-400">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>

      <div className="prose prose-stone mt-8">
        <h2>Éditeur du site</h2>
        <p>
          <strong>MeubleDesign.fr</strong><br />
          [Nom / Raison sociale à compléter]<br />
          [Adresse à compléter]<br />
          E-mail : contact@meuble-design.fr<br />
          Directeur de la publication : [Nom à compléter]
        </p>

        <h2>Hébergeur</h2>
        <p>
          Vercel Inc.<br />
          340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis<br />
          <a href="https://vercel.com" rel="noopener noreferrer" target="_blank">vercel.com</a>
        </p>

        <h2>Propriété intellectuelle</h2>
        <p>
          L'ensemble des contenus présents sur ce site (textes, images, graphismes) sont la propriété exclusive de MeubleDesign.fr, sauf mentions contraires.
          Toute reproduction est interdite sans autorisation préalable.
        </p>
        <p>
          Les liens de produits présents sur ce site sont des liens affiliés.
          MeubleDesign.fr peut percevoir une commission sur les achats réalisés via ces liens, sans surcoût pour l'acheteur.
        </p>

        <h2>Limitation de responsabilité</h2>
        <p>
          Les informations de prix sont indicatives et peuvent évoluer. MeubleDesign.fr ne saurait être tenu responsable des variations de prix ou de disponibilités chez les marchands partenaires.
        </p>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Conditions générales d'utilisation",
  description: "CGU de MeubleDesign.fr — conditions d'accès et d'utilisation du site.",
  path: "/cgu",
});

export default function CguPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-bold text-stone-900">Conditions générales d'utilisation</h1>
      <p className="mt-2 text-sm text-stone-400">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>

      <div className="prose prose-stone mt-8">
        <h2>Objet</h2>
        <p>Les présentes CGU régissent l'utilisation du site MeubleDesign.fr, site éditorial et d'affiliation dédié au mobilier et à la décoration design.</p>

        <h2>Accès au site</h2>
        <p>Le site est accessible gratuitement. MeubleDesign.fr se réserve le droit de le modifier, suspendre ou interrompre à tout moment sans préavis.</p>

        <h2>Contenus</h2>
        <p>Les articles, guides et comparatifs publiés sur ce site sont fournis à titre informatif. Les prix et disponibilités des produits mentionnés sont indicatifs et susceptibles d'évoluer.</p>

        <h2>Liens affiliés</h2>
        <p>Ce site contient des liens affiliés vers des marchands partenaires. La sélection des produits reste indépendante. La présence d'un lien affilié n'influence pas objectivement les avis exprimés.</p>

        <h2>Propriété intellectuelle</h2>
        <p>Tous les contenus du site (textes, images, mise en page) sont protégés. Toute reproduction sans autorisation est interdite.</p>

        <h2>Droit applicable</h2>
        <p>Les présentes CGU sont soumises au droit français. Tout litige relève de la compétence des tribunaux français.</p>
      </div>
    </div>
  );
}

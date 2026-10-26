import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Politique de confidentialité",
  description: "Politique de confidentialité et de gestion des données personnelles de MeubleDesign.fr — RGPD.",
  path: "/confidentialite",
});

export default function ConfidentialitePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-bold text-stone-900">Politique de confidentialité</h1>
      <p className="mt-2 text-sm text-stone-400">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>

      <div className="prose prose-stone mt-8">
        <h2>Données collectées</h2>
        <p>Ce site collecte des données de navigation anonymisées (pages vues, temps passé) via un outil d'analyse respectueux de la vie privée (Plausible Analytics). Ces données ne permettent pas de vous identifier personnellement.</p>
        <p>Si vous vous inscrivez à la newsletter, votre adresse e-mail est collectée avec votre consentement explicite.</p>

        <h2>Cookies</h2>
        <p>Nous utilisons des cookies fonctionnels (session, préférences) et, avec votre consentement, des cookies d'analyse. Vous pouvez modifier votre choix à tout moment.</p>

        <h2>Liens affiliés</h2>
        <p>Les liens vers les marchands partenaires sont des liens affiliés. Les marchands peuvent déposer leurs propres cookies de traçage (soumis à leur politique de confidentialité) lorsque vous cliquez sur ces liens.</p>

        <h2>Vos droits (RGPD)</h2>
        <p>Conformément au RGPD et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ces droits : <a href="mailto:contact@meuble-design.fr">contact@meuble-design.fr</a></p>

        <h2>Conservation des données</h2>
        <p>Les données de navigation anonymisées sont conservées 24 mois maximum. Les adresses e-mail (newsletter) sont conservées jusqu'à désinscription.</p>

        <h2>Contact</h2>
        <p>Pour toute question relative à vos données : <a href="mailto:contact@meuble-design.fr">contact@meuble-design.fr</a></p>
      </div>
    </div>
  );
}

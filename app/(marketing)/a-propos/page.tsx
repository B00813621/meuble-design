import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "À propos",
  description: "Qui sommes-nous ? MeubleDesign.fr est un site éditorial indépendant dédié au mobilier et à la décoration design accessible.",
  path: "/a-propos",
});

export default function AProposPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-bold text-stone-900">À propos de MeubleDesign</h1>

      <div className="prose prose-stone mt-8">
        <p className="lead text-lg text-stone-700">
          MeubleDesign.fr est un site éditorial indépendant créé par des passionnés de design et de décoration d'intérieur.
        </p>

        <h2>Notre mission</h2>
        <p>
          Rendre le design accessible à tous. Nous publions des guides d'achat, des comparatifs et des articles de fond
          pour vous aider à meubler votre intérieur avec style, quel que soit votre budget.
        </p>

        <h2>Notre indépendance éditoriale</h2>
        <p>
          Nos recommandations sont le fruit de recherches et d'analyses approfondies. Bien que ce site contienne des liens
          affiliés (nous percevons une petite commission sur les achats réalisés via ces liens), cela n'influence en
          aucune façon notre jugement éditorial.
        </p>

        <h2>Contact</h2>
        <p>Pour toute question, partenariat ou suggestion : <a href="mailto:contact@meuble-design.fr">contact@meuble-design.fr</a></p>
      </div>
    </div>
  );
}

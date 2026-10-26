import type { Comparatif } from "@/types";
import { AffiliateButton } from "./AffiliateButton";

interface Props {
  comparatif: Comparatif;
}

export function ComparisonTable({ comparatif }: Props) {
  return (
    <section aria-label={`Comparatif : ${comparatif.titre}`} className="my-8 overflow-x-auto">
      <h2 className="mb-4 font-serif text-2xl font-bold text-stone-900">
        {comparatif.titre}
      </h2>
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b-2 border-brand-700">
            <th className="py-3 pr-4 text-left font-semibold text-stone-700">Produit</th>
            {comparatif.colonnes.map((col) => (
              <th key={col} className="px-3 py-3 text-left font-semibold text-stone-700">
                {col}
              </th>
            ))}
            <th className="py-3 pl-4 text-left font-semibold text-stone-700">Offre</th>
          </tr>
        </thead>
        <tbody>
          {comparatif.items.map((item, i) => (
            <tr
              key={item.nom}
              className={`border-b border-stone-100 ${i === 0 ? "bg-brand-50" : "hover:bg-stone-50"}`}
            >
              <td className="py-4 pr-4 font-medium text-stone-900">
                {i === 0 && (
                  <span className="mr-2 inline-block rounded bg-brand-700 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    Meilleur choix
                  </span>
                )}
                {item.nom}
              </td>
              {comparatif.colonnes.map((col) => (
                <td key={col} className="px-3 py-4 text-stone-600">
                  {item[col] !== undefined ? String(item[col]) : "—"}
                </td>
              ))}
              <td className="py-4 pl-4">
                {item.lienAffilie ? (
                  <AffiliateButton
                    lien={{ marchand: "voir", url: item.lienAffilie, prixAffiche: item.prix }}
                    campaign={`comparatif-${comparatif.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-brand-700 px-4 py-2 text-xs font-semibold text-brand-700 transition hover:bg-brand-700 hover:text-white"
                  />
                ) : (
                  <span className="text-stone-400">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-xs text-stone-400">
        * Les prix sont indicatifs et peuvent varier. Liens affiliés (
        <abbr title="sponsored nofollow">sponsored nofollow</abbr>).
      </p>
    </section>
  );
}

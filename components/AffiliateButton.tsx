import type { LienAffilie } from "@/types";
import { buildAffiliateUrl, getMarchandLabel } from "@/lib/affiliate";

interface Props {
  lien: LienAffilie;
  className?: string;
  campaign?: string;
}

export function AffiliateButton({ lien, className, campaign }: Props) {
  const href = buildAffiliateUrl(lien, {
    source: "meuble-design",
    medium: "affiliation",
    campaign,
  });

  return (
    <a
      href={href}
      rel="sponsored nofollow"
      target="_blank"
      className={
        className ??
        "inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-700"
      }
    >
      Voir l&apos;offre
      {lien.prixAffiche && (
        <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs">
          {lien.prixAffiche}
        </span>
      )}
      <span className="sr-only">chez {getMarchandLabel(lien.marchand)} (lien affilié, ouvre dans un nouvel onglet)</span>
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        className="h-3.5 w-3.5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
      </svg>
    </a>
  );
}

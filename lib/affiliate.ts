import type { LienAffilie } from "@/types";

/**
 * Construit un lien affilié tracké.
 * Le paramètre `utm_source` permet de mesurer la source côté Google Analytics / Plausible.
 * rel="sponsored nofollow" doit toujours être appliqué sur le <a> (voir AffiliateButton).
 */
export function buildAffiliateUrl(
  lien: LienAffilie,
  opts?: { source?: string; medium?: string; campaign?: string }
): string {
  try {
    const url = new URL(lien.url);
    if (opts?.source) url.searchParams.set("utm_source", opts.source);
    if (opts?.medium) url.searchParams.set("utm_medium", opts.medium ?? "affiliation");
    if (opts?.campaign) url.searchParams.set("utm_campaign", opts.campaign);
    return url.toString();
  } catch {
    return lien.url;
  }
}

export function getMarchandLabel(marchand: string): string {
  const labels: Record<string, string> = {
    amazon: "Amazon",
    cdiscount: "Cdiscount",
    maisons_du_monde: "Maisons du Monde",
    la_redoute: "La Redoute",
    habitat: "Habitat",
    ikea: "IKEA",
    westwing: "WestwingNow",
    alinea: "Alinéa",
  };
  return labels[marchand.toLowerCase()] ?? marchand;
}

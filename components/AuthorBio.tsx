interface Props {
  auteur?: string;
  dateMaj?: string;
}

export function AuthorBio({ auteur, dateMaj }: Props) {
  if (!auteur) return null;

  const initiales = auteur
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="mt-12 flex gap-5 rounded-2xl border border-stone-100 bg-stone-50 p-6">
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-700"
        aria-hidden
      >
        {initiales}
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-stone-900">{auteur}</p>
        <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-brand-600">
          Rédacteur spécialisé mobilier &amp; décoration
        </p>
        <p className="mt-2 text-sm leading-relaxed text-stone-500">
          Notre équipe sélectionne et analyse chaque meuble selon des critères stricts : qualité
          de fabrication, rapport qualité/prix, esthétique et durabilité. Nos recommandations sont
          indépendantes et ne sont jamais influencées par les marchands partenaires.
        </p>
        {dateMaj && (
          <p className="mt-2 text-xs text-stone-400">
            Dernière mise à jour :{" "}
            {new Date(dateMaj).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}
      </div>
    </aside>
  );
}

export function AffiliateDisclosure() {
  return (
    <aside
      role="note"
      aria-label="Information affiliation"
      className="my-6 flex items-start gap-3 rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800"
    >
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p>
        <strong>Transparence :</strong> cet article contient des liens affiliés. Si vous achetez via ces liens, nous percevons une petite commission — sans surcoût pour vous. Cela nous permet de financer le site et de rester indépendants.
      </p>
    </aside>
  );
}

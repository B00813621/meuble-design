import type { FAQ } from "@/types";

interface Props {
  faqs: FAQ[];
  className?: string;
}

export function FAQSection({ faqs, className }: Props) {
  if (!faqs?.length) return null;

  return (
    <section className={`mt-12 ${className ?? ""}`} aria-label="Questions fréquentes">
      <h2 className="mb-6 font-serif text-2xl font-bold text-stone-900">Questions fréquentes</h2>
      <div className="divide-y divide-stone-100 overflow-hidden rounded-2xl border border-stone-100">
        {faqs.map((faq, i) => (
          <details key={i} className="group bg-white px-6 py-4 transition-colors open:bg-stone-50">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-medium text-stone-800">
              <span className="pt-0.5">{faq.question}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mt-0.5 h-5 w-5 shrink-0 text-brand-600 transition-transform duration-200 group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">{faq.reponse}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

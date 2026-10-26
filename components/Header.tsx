import Link from "next/link";

const BOUTIQUE_SUBCATS = [
  { href: "/categories/canapes",        label: "Canapés" },
  { href: "/categories/lampes",         label: "Lampes" },
  { href: "/categories/lampes-chevet",  label: "Lampes de chevet" },
  { href: "/categories/chaises",        label: "Chaises" },
  { href: "/categories/tables",         label: "Tables" },
];

const GUIDE_SUBCATS = [
  { href: "/guides",      label: "Guides d'achat" },
  { href: "/blog",        label: "Articles déco" },
  { href: "/comparatifs", label: "Comparatifs" },
];

function DropdownNav({
  href,
  label,
  items,
}: {
  href: string;
  label: string;
  items: { href: string; label: string }[];
}) {
  return (
    <li className="group relative">
      {/* Lien principal */}
      <Link
        href={href}
        className="flex items-center gap-1 rounded-full px-5 py-2 text-sm font-semibold text-stone-700 transition hover:bg-brand-50 hover:text-brand-700"
      >
        {label}
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5 text-stone-400 transition group-hover:text-brand-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </Link>

      {/* Dropdown — CSS only via group-hover */}
      <div className="invisible absolute left-1/2 top-full z-50 mt-1 w-52 -translate-x-1/2 rounded-2xl border border-stone-100 bg-white py-2 opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:opacity-100">
        {/* Flèche décorative */}
        <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-stone-100 bg-white" />
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block px-4 py-2.5 text-sm text-stone-600 transition hover:bg-brand-50 hover:text-brand-700"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </li>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-stone-900">
            Meuble<span className="text-brand-700">Design</span>
          </Link>

          {/* Nav centrée */}
          <nav aria-label="Navigation principale" className="hidden md:block">
            <ul className="flex items-center gap-1">
              <DropdownNav href="/boutique" label="Boutique" items={BOUTIQUE_SUBCATS} />
              <DropdownNav href="/guides"   label="Guide"    items={GUIDE_SUBCATS} />
            </ul>
          </nav>

          {/* Mobile burger */}
          <details className="relative md:hidden">
            <summary className="cursor-pointer list-none rounded-full p-2 text-stone-500 hover:bg-stone-100">
              <svg aria-label="Menu" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </summary>
            <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-stone-200 bg-white py-2 shadow-lg">
              <p className="px-4 pt-1 pb-0.5 text-[10px] font-bold uppercase tracking-widest text-stone-400">Boutique</p>
              {BOUTIQUE_SUBCATS.map((item) => (
                <Link key={item.href} href={item.href} className="block px-4 py-2 text-sm text-stone-700 hover:bg-brand-50 hover:text-brand-700">{item.label}</Link>
              ))}
              <p className="mt-2 px-4 pt-1 pb-0.5 text-[10px] font-bold uppercase tracking-widest text-stone-400">Guide</p>
              {GUIDE_SUBCATS.map((item) => (
                <Link key={item.href} href={item.href} className="block px-4 py-2 text-sm text-stone-700 hover:bg-brand-50 hover:text-brand-700">{item.label}</Link>
              ))}
            </div>
          </details>
        </div>

        {/* Barre de séparation */}
        <div className="h-px bg-stone-100" />
      </div>
    </header>
  );
}

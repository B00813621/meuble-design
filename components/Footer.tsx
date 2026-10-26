import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="font-serif text-lg font-bold text-stone-900">
              Meuble<span className="text-brand-700">Design</span>
            </Link>
            <p className="mt-2 text-xs text-stone-500">
              Guides, comparatifs et sélections de meubles design accessibles.
            </p>
          </div>

          <nav aria-label="Contenus">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">Contenus</h3>
            <ul className="mt-3 space-y-2 text-sm text-stone-600">
              <li><Link href="/blog" className="hover:text-brand-700">Articles</Link></li>
              <li><Link href="/guides" className="hover:text-brand-700">Guides d'achat</Link></li>
              <li><Link href="/comparatifs" className="hover:text-brand-700">Comparatifs</Link></li>
            </ul>
          </nav>

          <nav aria-label="Catégories">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">Catégories</h3>
            <ul className="mt-3 space-y-2 text-sm text-stone-600">
              <li><Link href="/categories/salon" className="hover:text-brand-700">Salon</Link></li>
              <li><Link href="/categories/bureau" className="hover:text-brand-700">Bureau</Link></li>
              <li><Link href="/categories/chambre" className="hover:text-brand-700">Chambre</Link></li>
              <li><Link href="/categories/luminaire" className="hover:text-brand-700">Luminaires</Link></li>
            </ul>
          </nav>

          <nav aria-label="Informations légales">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">Légal</h3>
            <ul className="mt-3 space-y-2 text-sm text-stone-600">
              <li><Link href="/mentions-legales" className="hover:text-brand-700">Mentions légales</Link></li>
              <li><Link href="/confidentialite" className="hover:text-brand-700">Confidentialité</Link></li>
              <li><Link href="/cgu" className="hover:text-brand-700">CGU</Link></li>
              <li><Link href="/a-propos" className="hover:text-brand-700">À propos</Link></li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 border-t border-stone-200 pt-6 text-center text-xs text-stone-400">
          <p>
            © {year} MeubleDesign.fr — Site indépendant. Les liens de produits sont des liens affiliés (
            <abbr title="les prix et disponibilités peuvent varier">prix indicatifs</abbr>).
          </p>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page introuvable | MeubleDesign",
  robots: { index: false },
};

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-serif text-7xl font-bold text-brand-200">404</p>
      <h1 className="mt-4 font-serif text-2xl font-bold text-stone-900">Page introuvable</h1>
      <p className="mt-2 text-stone-500">Cette page n'existe pas ou a été déplacée.</p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-brand-700 px-6 py-3 font-semibold text-white transition hover:bg-brand-800"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/boutique?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl" role="search">
      <label htmlFor="search-home" className="sr-only">Rechercher un meuble</label>
      <div className="relative">
        <input
          id="search-home"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un meuble, une lampe, un canapé…"
          className="w-full rounded-full border border-stone-200 bg-white py-4 pl-6 pr-14 text-base text-stone-800 shadow-sm placeholder:text-stone-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
        <button
          type="submit"
          aria-label="Lancer la recherche"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-brand-700 p-2.5 text-white transition hover:bg-brand-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </form>
  );
}

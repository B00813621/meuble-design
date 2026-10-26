"use client";

import Link from "next/link";
import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="mt-6 rounded-full bg-white/20 px-6 py-3 font-semibold text-white">
        Merci ! Vous serez parmi les premiers informés.
      </p>
    );
  }

  return (
    <>
      <form className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
        <label htmlFor="newsletter-email" className="sr-only">
          Votre adresse e-mail
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.fr"
          className="flex-1 rounded-full border-0 px-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-white"
        />
        <button
          type="submit"
          className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
        >
          S'abonner
        </button>
      </form>
      <p className="mt-3 text-xs text-brand-200">
        Pas de spam. Désinscription en un clic. Voir notre{" "}
        <Link href="/confidentialite" className="underline hover:text-white">
          politique de confidentialité
        </Link>
        .
      </p>
    </>
  );
}

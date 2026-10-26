"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

type FAQ = { question: string; reponse: string };

type Frontmatter = {
  titre: string;
  metaDescription: string;
  type: "article" | "guide" | "comparatif";
  datePublication: string;
  dateMaj: string;
  auteur: string;
  image: string;
  imageAlt: string;
  tags: string;
  contientLiensAffilies: boolean;
  faqs: FAQ[];
};

type Props = {
  initialSlug?: string;
  initialFrontmatter?: Partial<Frontmatter>;
  initialContent?: string;
  isNew?: boolean;
};

const TYPE_PATH = { article: "blog", guide: "guides", comparatif: "comparatifs" };

export function ArticleForm({ initialSlug = "", initialFrontmatter, initialContent = "", isNew = false }: Props) {
  const router = useRouter();

  const [slug, setSlug] = useState(initialSlug);
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [imagePicker, setImagePicker] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [imageField, setImageField] = useState<"image" | null>(null);

  const [fm, setFm] = useState<Frontmatter>({
    titre: initialFrontmatter?.titre ?? "",
    metaDescription: initialFrontmatter?.metaDescription ?? "",
    type: initialFrontmatter?.type ?? "article",
    datePublication: initialFrontmatter?.datePublication?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
    dateMaj: initialFrontmatter?.dateMaj?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
    auteur: initialFrontmatter?.auteur ?? "Équipe MeubleDesign",
    image: initialFrontmatter?.image ?? "",
    imageAlt: initialFrontmatter?.imageAlt ?? "",
    tags: Array.isArray(initialFrontmatter?.tags) ? (initialFrontmatter.tags as string[]).join(", ") : "",
    contientLiensAffilies: initialFrontmatter?.contientLiensAffilies ?? false,
    faqs: (initialFrontmatter?.faqs as FAQ[]) ?? [],
  });

  const set = (key: keyof Frontmatter, val: unknown) =>
    setFm((prev) => ({ ...prev, [key]: val }));

  const autoSlug = (titre: string) =>
    titre.toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const openImagePicker = async (field: "image") => {
    setImageField(field);
    const res = await fetch("/api/admin/images");
    setImages(await res.json());
    setImagePicker(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const { url } = await res.json();
    if (imageField) set(imageField, url);
    const listRes = await fetch("/api/admin/images");
    setImages(await listRes.json());
    setUploadingImg(false);
  };

  const handleSave = useCallback(async () => {
    setSaving(true);
    setError("");
    const frontmatter = {
      titre: fm.titre,
      metaDescription: fm.metaDescription,
      type: fm.type,
      datePublication: fm.datePublication ? new Date(fm.datePublication).toISOString() : new Date().toISOString(),
      dateMaj: fm.dateMaj ? new Date(fm.dateMaj).toISOString() : new Date().toISOString(),
      auteur: fm.auteur || undefined,
      image: fm.image || undefined,
      imageAlt: fm.imageAlt || undefined,
      tags: fm.tags.split(",").map((t) => t.trim()).filter(Boolean),
      contientLiensAffilies: fm.contientLiensAffilies,
      faqs: fm.faqs.length > 0 ? fm.faqs : undefined,
    };

    if (isNew) {
      const res = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: fm.type, slug, frontmatter, content }),
      });
      if (res.status === 409) { setError("Ce slug existe déjà."); setSaving(false); return; }
      if (!res.ok) { setError("Erreur lors de la création."); setSaving(false); return; }
      const { slug: created } = await res.json();
      router.push(`/admin/articles/${fm.type}/${created}`);
    } else {
      const res = await fetch(`/api/admin/articles/${fm.type}/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frontmatter, content }),
      });
      if (!res.ok) { setError("Erreur lors de la sauvegarde."); setSaving(false); return; }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
    setSaving(false);
  }, [fm, slug, content, isNew, router]);

  const addFAQ = () => set("faqs", [...fm.faqs, { question: "", reponse: "" }]);
  const removeFAQ = (i: number) => set("faqs", fm.faqs.filter((_, idx) => idx !== i));
  const updateFAQ = (i: number, field: keyof FAQ, val: string) =>
    set("faqs", fm.faqs.map((faq, idx) => (idx === i ? { ...faq, [field]: val } : faq)));

  const previewUrl = `/${TYPE_PATH[fm.type]}/${slug}`;

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-stone-200 bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/articles")}
            className="text-sm text-stone-400 hover:text-stone-700"
          >
            ← Articles
          </button>
          <span className="text-stone-200">|</span>
          <div className="flex gap-1 rounded-lg bg-stone-100 p-0.5 text-sm">
            {(["edit", "preview"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-md px-3 py-1 font-medium transition ${
                  tab === t ? "bg-white shadow-sm text-stone-900" : "text-stone-500"
                }`}
              >
                {t === "edit" ? "Édition" : "Prévisualiser"}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {error && <span className="text-xs text-red-500">{error}</span>}
          {saved && <span className="text-xs text-green-600">✓ Sauvegardé</span>}
          {!isNew && (
            <a
              href={previewUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-stone-200 px-3 py-1.5 text-sm text-stone-600 transition hover:bg-stone-50"
            >
              Voir sur le site ↗
            </a>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-stone-900 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-stone-700 disabled:opacity-60"
          >
            {saving ? "Sauvegarde..." : isNew ? "Créer l'article" : "Sauvegarder"}
          </button>
        </div>
      </header>

      {tab === "preview" ? (
        <div className="flex flex-1 items-center justify-center bg-stone-100">
          <div className="flex flex-col items-center gap-4">
            <p className="text-stone-500">Sauvegardez d'abord, puis ouvrez la prévisualisation :</p>
            <a
              href={previewUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white"
            >
              Ouvrir /{TYPE_PATH[fm.type]}/{slug || "..."} ↗
            </a>
            <p className="text-xs text-stone-400">
              Le serveur Next.js rechargera automatiquement l'article modifié.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* Left: MDX content */}
          <div className="flex w-[55%] flex-col border-r border-stone-200">
            <div className="flex items-center gap-2 border-b border-stone-100 bg-stone-50 px-4 py-2 text-xs font-medium text-stone-500">
              <span>Contenu MDX</span>
              <span className="ml-auto text-stone-300">{content.length} caractères</span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`## Introduction\n\nCommencez à rédiger votre article en Markdown...\n\n## Première section\n\n...`}
              className="flex-1 resize-none bg-white p-5 font-mono text-sm text-stone-800 outline-none placeholder:text-stone-300"
              spellCheck
            />
          </div>

          {/* Right: Frontmatter */}
          <div className="flex w-[45%] flex-col overflow-y-auto bg-stone-50">
            <div className="border-b border-stone-100 bg-stone-50 px-4 py-2 text-xs font-medium text-stone-500">
              Métadonnées
            </div>
            <div className="space-y-5 p-5">

              {isNew && (
                <Field label="Slug (URL)">
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="mon-article-sur-les-canapes"
                    className={inputCls}
                  />
                  {fm.titre && (
                    <button
                      type="button"
                      onClick={() => setSlug(autoSlug(fm.titre))}
                      className="mt-1 text-xs text-brand-700 hover:underline"
                    >
                      Générer depuis le titre
                    </button>
                  )}
                </Field>
              )}

              <Field label="Type de contenu">
                <select
                  value={fm.type}
                  onChange={(e) => set("type", e.target.value)}
                  className={inputCls}
                >
                  <option value="article">Article</option>
                  <option value="guide">Guide d'achat</option>
                  <option value="comparatif">Comparatif</option>
                </select>
              </Field>

              <Field label="Titre *">
                <input
                  type="text"
                  value={fm.titre}
                  onChange={(e) => set("titre", e.target.value)}
                  placeholder="10 tendances déco 2025..."
                  className={inputCls}
                />
              </Field>

              <Field label="Meta description *" hint="120–160 caractères recommandés">
                <textarea
                  value={fm.metaDescription}
                  onChange={(e) => set("metaDescription", e.target.value)}
                  rows={3}
                  placeholder="Découvrez les meilleures..."
                  className={inputCls + " resize-none"}
                />
                <span className={`mt-0.5 text-right text-xs ${fm.metaDescription.length > 160 ? "text-red-500" : "text-stone-400"}`}>
                  {fm.metaDescription.length} / 160
                </span>
              </Field>

              <Field label="Auteur">
                <input
                  type="text"
                  value={fm.auteur}
                  onChange={(e) => set("auteur", e.target.value)}
                  placeholder="Équipe MeubleDesign"
                  className={inputCls}
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Date de publication">
                  <input type="date" value={fm.datePublication} onChange={(e) => set("datePublication", e.target.value)} className={inputCls} />
                </Field>
                <Field label="Dernière mise à jour">
                  <input type="date" value={fm.dateMaj} onChange={(e) => set("dateMaj", e.target.value)} className={inputCls} />
                </Field>
              </div>

              <Field label="Image principale">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={fm.image}
                    onChange={(e) => set("image", e.target.value)}
                    placeholder="/images/articles/mon-image.jpg"
                    className={inputCls + " flex-1"}
                  />
                  <button
                    type="button"
                    onClick={() => openImagePicker("image")}
                    className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-50"
                  >
                    Choisir
                  </button>
                </div>
                {fm.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={fm.image} alt={fm.imageAlt} className="mt-2 h-24 w-full rounded-lg object-cover" />
                )}
              </Field>

              <Field label="Alt de l'image">
                <input
                  type="text"
                  value={fm.imageAlt}
                  onChange={(e) => set("imageAlt", e.target.value)}
                  placeholder="Canapé velours vert dans un salon..."
                  className={inputCls}
                />
              </Field>

              <Field label="Tags" hint="Séparés par des virgules">
                <input
                  type="text"
                  value={fm.tags}
                  onChange={(e) => set("tags", e.target.value)}
                  placeholder="tendances, décoration, 2025"
                  className={inputCls}
                />
              </Field>

              <Field label="">
                <label className="flex cursor-pointer items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={fm.contientLiensAffilies}
                    onChange={(e) => set("contientLiensAffilies", e.target.checked)}
                    className="h-4 w-4 rounded border-stone-300 text-stone-900"
                  />
                  <span className="text-sm text-stone-700">Contient des liens affiliés</span>
                </label>
              </Field>

              {/* FAQ section */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Questions fréquentes (FAQ)
                  </label>
                  <button
                    type="button"
                    onClick={addFAQ}
                    className="rounded-md bg-stone-200 px-2 py-1 text-xs font-medium text-stone-700 hover:bg-stone-300"
                  >
                    + Ajouter
                  </button>
                </div>
                <div className="space-y-3">
                  {fm.faqs.map((faq, i) => (
                    <div key={i} className="rounded-lg border border-stone-200 bg-white p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-medium text-stone-500">FAQ {i + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeFAQ(i)}
                          className="text-xs text-red-400 hover:text-red-600"
                        >
                          Supprimer
                        </button>
                      </div>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => updateFAQ(i, "question", e.target.value)}
                        placeholder="Question..."
                        className={inputCls + " mb-2"}
                      />
                      <textarea
                        value={faq.reponse}
                        onChange={(e) => updateFAQ(i, "reponse", e.target.value)}
                        placeholder="Réponse..."
                        rows={3}
                        className={inputCls + " resize-none"}
                      />
                    </div>
                  ))}
                  {fm.faqs.length === 0 && (
                    <p className="text-xs text-stone-400">Aucune FAQ. Cliquez sur + Ajouter.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image picker modal */}
      {imagePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
          <div className="flex max-h-[80vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
              <h2 className="font-semibold text-stone-900">Bibliothèque d'images</h2>
              <button onClick={() => setImagePicker(false)} className="text-stone-400 hover:text-stone-700">
                ✕
              </button>
            </div>
            <div className="p-5">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-stone-200 p-4 text-sm text-stone-500 hover:border-stone-400">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                {uploadingImg ? "Upload en cours..." : "+ Uploader une nouvelle image"}
              </label>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-5">
              {images.length === 0 ? (
                <p className="text-center text-sm text-stone-400">Aucune image. Uploadez votre première image ci-dessus.</p>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {images.map((src) => (
                    <button
                      key={src}
                      onClick={() => {
                        if (imageField) set(imageField, src);
                        setImagePicker(false);
                      }}
                      className="group relative overflow-hidden rounded-lg border-2 border-transparent hover:border-stone-900"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={src} className="h-32 w-full object-cover" />
                      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/40 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
                        <span className="truncate text-xs text-white">{src.split("/").pop()}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls = "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      {label && (
        <label className="mb-1.5 flex items-baseline justify-between text-xs font-semibold uppercase tracking-wide text-stone-500">
          <span>{label}</span>
          {hint && <span className="text-[10px] font-normal normal-case text-stone-400">{hint}</span>}
        </label>
      )}
      {children}
    </div>
  );
}

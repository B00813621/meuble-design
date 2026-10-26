"use client";
import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { RichEditor, type RichEditorRef } from "./RichEditor";

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

const CALLOUT_TYPES = [
  { type: "conseil",      emoji: "💡", label: "Conseil" },
  { type: "attention",    emoji: "⚠️", label: "Attention" },
  { type: "interdiction", emoji: "🚫", label: "À éviter" },
  { type: "info",         emoji: "ℹ️", label: "Info" },
  { type: "astuce",       emoji: "✨", label: "Astuce" },
  { type: "important",    emoji: "📌", label: "Important" },
];

export function ArticleForm({ initialSlug = "", initialFrontmatter, initialContent = "", isNew = false }: Props) {
  const router = useRouter();
  const editorRef = useRef<RichEditorRef>(null);

  const [slug, setSlug] = useState(initialSlug);
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Image picker
  const [imagePicker, setImagePicker] = useState(false);
  const [imageMode, setImageMode] = useState<"field" | "insert">("field");
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImg, setUploadingImg] = useState(false);

  // Callout dropdown
  const [showCalloutMenu, setShowCalloutMenu] = useState(false);

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
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  // ── Image picker ────────────────────────────────────────────────────────────

  const loadImages = async () => {
    const res = await fetch("/api/admin/images");
    setImages(await res.json());
  };

  const openImageField = async () => {
    setImageMode("field");
    await loadImages();
    setImagePicker(true);
  };

  const openImageInsert = async () => {
    setImageMode("insert");
    await loadImages();
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
    if (imageMode === "insert") {
      editorRef.current?.insertImage(url, file.name.replace(/\.[^.]+$/, ""));
      setImagePicker(false);
    } else {
      set("image", url);
      await loadImages();
    }
    setUploadingImg(false);
  };

  const selectImage = (src: string) => {
    if (imageMode === "insert") {
      editorRef.current?.insertImage(src, "Image");
    } else {
      set("image", src);
    }
    setImagePicker(false);
  };

  // ── Save ────────────────────────────────────────────────────────────────────

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

  // ── FAQ helpers ─────────────────────────────────────────────────────────────

  const addFAQ = () => set("faqs", [...fm.faqs, { question: "", reponse: "" }]);
  const removeFAQ = (i: number) => set("faqs", fm.faqs.filter((_, idx) => idx !== i));
  const updateFAQ = (i: number, field: keyof FAQ, val: string) =>
    set("faqs", fm.faqs.map((faq, idx) => (idx === i ? { ...faq, [field]: val } : faq)));

  const previewUrl = `/${TYPE_PATH[fm.type]}/${slug}`;

  return (
    <div className="flex h-screen flex-col" onClick={() => setShowCalloutMenu(false)}>

      {/* ── Header ── */}
      <header className="flex shrink-0 items-center justify-between border-b border-stone-200 bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/admin/articles")} className="text-sm text-stone-400 hover:text-stone-700">
            ← Articles
          </button>
        </div>
        <div className="flex items-center gap-2">
          {error && <span className="text-xs text-red-500">{error}</span>}
          {saved && <span className="text-xs text-green-600">✓ Sauvegardé</span>}
          {!isNew && (
            <a href={previewUrl} target="_blank" rel="noreferrer"
              className="rounded-lg border border-stone-200 px-3 py-1.5 text-sm text-stone-600 transition hover:bg-stone-50">
              Voir sur le site ↗
            </a>
          )}
          <button onClick={handleSave} disabled={saving}
            className="rounded-lg bg-stone-900 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-stone-700 disabled:opacity-60">
            {saving ? "Sauvegarde..." : isNew ? "Créer l'article" : "Sauvegarder"}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* ── Left: rich editor ── */}
        <div className="flex w-[58%] flex-col border-r border-stone-200">

          {/* Toolbar */}
          <div className="flex shrink-0 flex-wrap items-center gap-0.5 border-b border-stone-100 bg-stone-50 px-3 py-2"
            onClick={(e) => e.stopPropagation()}>

            <Btn title="Gras (Ctrl+B)" onClick={() => editorRef.current?.applyFormat("bold")}>
              <strong className="text-sm">B</strong>
            </Btn>
            <Btn title="Italique (Ctrl+I)" onClick={() => editorRef.current?.applyFormat("italic")}>
              <em className="text-sm">I</em>
            </Btn>
            <Sep />
            <Btn title="Titre H2" onClick={() => editorRef.current?.applyFormat("h2")}>
              <span className="text-xs font-bold">H2</span>
            </Btn>
            <Btn title="Sous-titre H3" onClick={() => editorRef.current?.applyFormat("h3")}>
              <span className="text-xs font-bold">H3</span>
            </Btn>
            <Btn title="Titre H4" onClick={() => editorRef.current?.applyFormat("h4")}>
              <span className="text-xs font-bold">H4</span>
            </Btn>
            <Sep />
            <Btn title="Liste à puces" onClick={() => editorRef.current?.applyFormat("ul")}>
              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="2" cy="4" r="1.5"/><rect x="5" y="3" width="10" height="2" rx="1"/>
                <circle cx="2" cy="8" r="1.5"/><rect x="5" y="7" width="10" height="2" rx="1"/>
                <circle cx="2" cy="12" r="1.5"/><rect x="5" y="11" width="10" height="2" rx="1"/>
              </svg>
            </Btn>
            <Btn title="Liste numérotée" onClick={() => editorRef.current?.applyFormat("ol")}>
              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
                <text x="0" y="5" fontSize="5" fontWeight="bold">1.</text>
                <rect x="5" y="3" width="10" height="2" rx="1"/>
                <text x="0" y="9" fontSize="5" fontWeight="bold">2.</text>
                <rect x="5" y="7" width="10" height="2" rx="1"/>
                <text x="0" y="13" fontSize="5" fontWeight="bold">3.</text>
                <rect x="5" y="11" width="10" height="2" rx="1"/>
              </svg>
            </Btn>
            <Btn title="Citation" onClick={() => editorRef.current?.applyFormat("quote")}>
              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
                <rect x="1" y="2" width="2" height="12" rx="1" opacity=".4"/>
                <path d="M4 4h8v2H4zm0 4h6v2H4z"/>
              </svg>
            </Btn>
            <Btn title="Lien" onClick={() => editorRef.current?.applyFormat("link")}>
              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6.5 9.5a3.5 3.5 0 005 0l2-2a3.5 3.5 0 00-5-5l-1 1"/>
                <path d="M9.5 6.5a3.5 3.5 0 00-5 0l-2 2a3.5 3.5 0 005 5l1-1"/>
              </svg>
            </Btn>
            <Btn title="Ligne de séparation" onClick={() => editorRef.current?.applyFormat("separator")}>
              <span className="text-xs">—</span>
            </Btn>
            <Sep />

            {/* Image insert */}
            <Btn title="Insérer une image depuis la photothèque" onClick={openImageInsert}>
              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="1" y="2" width="14" height="12" rx="2"/>
                <circle cx="5.5" cy="6" r="1.5"/>
                <path d="M1 11l4-4 3 3 2-2 5 5"/>
              </svg>
            </Btn>
            <Sep />

            {/* Callout dropdown */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <Btn title="Insérer un callout" onClick={() => setShowCalloutMenu((v) => !v)}>
                <span className="text-xs font-medium">Callout ▾</span>
              </Btn>
              {showCalloutMenu && (
                <div className="absolute left-0 top-full z-40 mt-1 w-44 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-lg">
                  {CALLOUT_TYPES.map(({ type, emoji, label }) => (
                    <button key={type} onClick={() => { editorRef.current?.insertCallout(type); setShowCalloutMenu(false); }}
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-stone-700 transition hover:bg-stone-50">
                      <span>{emoji}</span>
                      <span className="font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RichEditor */}
          <RichEditor
            ref={editorRef}
            defaultValue={initialContent}
            onChange={setContent}
          />
        </div>

        {/* ── Right: frontmatter ── */}
        <div className="flex w-[42%] flex-col overflow-y-auto bg-stone-50">
          <div className="border-b border-stone-100 px-4 py-2 text-xs font-medium text-stone-500">Métadonnées</div>
          <div className="space-y-5 p-5">

            {isNew && (
              <Field label="Slug (URL)">
                <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)}
                  placeholder="mon-article-sur-les-canapes" className={ic} />
                {fm.titre && (
                  <button type="button" onClick={() => setSlug(autoSlug(fm.titre))}
                    className="mt-1 text-xs text-brand-700 hover:underline">
                    Générer depuis le titre
                  </button>
                )}
              </Field>
            )}

            <Field label="Type de contenu">
              <select value={fm.type} onChange={(e) => set("type", e.target.value)} className={ic}>
                <option value="article">Article</option>
                <option value="guide">Guide d'achat</option>
                <option value="comparatif">Comparatif</option>
              </select>
            </Field>

            <Field label="Titre *">
              <input type="text" value={fm.titre} onChange={(e) => set("titre", e.target.value)}
                placeholder="10 tendances déco 2025..." className={ic} />
            </Field>

            <Field label="Meta description *" hint="120–160 car.">
              <textarea value={fm.metaDescription} onChange={(e) => set("metaDescription", e.target.value)}
                rows={3} placeholder="Découvrez..." className={ic + " resize-none"} />
              <span className={`mt-0.5 block text-right text-xs ${fm.metaDescription.length > 160 ? "text-red-500" : "text-stone-400"}`}>
                {fm.metaDescription.length} / 160
              </span>
            </Field>

            <Field label="Auteur">
              <input type="text" value={fm.auteur} onChange={(e) => set("auteur", e.target.value)}
                placeholder="Équipe MeubleDesign" className={ic} />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Publication">
                <input type="date" value={fm.datePublication} onChange={(e) => set("datePublication", e.target.value)} className={ic} />
              </Field>
              <Field label="Mis à jour">
                <input type="date" value={fm.dateMaj} onChange={(e) => set("dateMaj", e.target.value)} className={ic} />
              </Field>
            </div>

            <Field label="Image principale">
              <div className="flex gap-2">
                <input type="text" value={fm.image} onChange={(e) => set("image", e.target.value)}
                  placeholder="/images/articles/..." className={ic + " flex-1"} />
                <button type="button" onClick={openImageField}
                  className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-50">
                  📷
                </button>
              </div>
              {fm.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={fm.image} alt={fm.imageAlt} className="mt-2 h-20 w-full rounded-lg object-cover" />
              )}
            </Field>

            <Field label="Alt de l'image">
              <input type="text" value={fm.imageAlt} onChange={(e) => set("imageAlt", e.target.value)}
                placeholder="Canapé velours dans un salon..." className={ic} />
            </Field>

            <Field label="Tags" hint="Séparés par des virgules">
              <input type="text" value={fm.tags} onChange={(e) => set("tags", e.target.value)}
                placeholder="tendances, décoration, 2025" className={ic} />
            </Field>

            <Field label="">
              <label className="flex cursor-pointer items-center gap-2.5">
                <input type="checkbox" checked={fm.contientLiensAffilies}
                  onChange={(e) => set("contientLiensAffilies", e.target.checked)}
                  className="h-4 w-4 rounded border-stone-300" />
                <span className="text-sm text-stone-700">Contient des liens affiliés</span>
              </label>
            </Field>

            {/* FAQ */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wide text-stone-500">FAQ</label>
                <button type="button" onClick={addFAQ}
                  className="rounded-md bg-stone-200 px-2 py-1 text-xs font-medium text-stone-700 hover:bg-stone-300">
                  + Ajouter
                </button>
              </div>
              <div className="space-y-3">
                {fm.faqs.map((faq, i) => (
                  <div key={i} className="rounded-lg border border-stone-200 bg-white p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-stone-500">FAQ {i + 1}</span>
                      <button type="button" onClick={() => removeFAQ(i)} className="text-xs text-red-400 hover:text-red-600">Supprimer</button>
                    </div>
                    <input type="text" value={faq.question} onChange={(e) => updateFAQ(i, "question", e.target.value)}
                      placeholder="Question..." className={ic + " mb-2"} />
                    <textarea value={faq.reponse} onChange={(e) => updateFAQ(i, "reponse", e.target.value)}
                      placeholder="Réponse..." rows={3} className={ic + " resize-none"} />
                  </div>
                ))}
                {fm.faqs.length === 0 && <p className="text-xs text-stone-400">Aucune FAQ. Cliquez + Ajouter.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Image picker modal ── */}
      {imagePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
          <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
              <h2 className="font-semibold text-stone-900">
                {imageMode === "insert" ? "📷 Insérer une image dans l'article" : "📷 Image principale"}
              </h2>
              <button onClick={() => setImagePicker(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            {/* Upload */}
            <div className="px-5 pt-4">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-stone-200 p-4 text-sm text-stone-500 transition hover:border-stone-400 hover:bg-stone-50">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <span className="text-2xl">📤</span>
                <div>
                  <p className="font-medium">{uploadingImg ? "Upload en cours..." : "Importer depuis mon ordinateur"}</p>
                  <p className="text-xs text-stone-400">Sauvegardée automatiquement dans la photothèque — JPG, PNG, WebP, max 10 Mo</p>
                </div>
              </label>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-5">
              {images.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-4xl">📷</p>
                  <p className="mt-3 text-sm text-stone-400">Photothèque vide. Importez votre première image ci-dessus.</p>
                </div>
              ) : (
                <>
                  <p className="mb-3 text-xs text-stone-400">
                    {images.length} image{images.length > 1 ? "s" : ""} — cliquez pour {imageMode === "insert" ? "insérer" : "sélectionner"}
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {images.map((src) => (
                      <button key={src} onClick={() => selectImage(src)}
                        className="group relative overflow-hidden rounded-xl border-2 border-transparent transition hover:border-stone-900 hover:shadow-md">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="" className="h-32 w-full object-cover" />
                        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
                          <span className="rounded-lg bg-white px-2 py-1 text-xs font-bold text-stone-900">
                            {imageMode === "insert" ? "Insérer" : "Choisir"}
                          </span>
                        </div>
                        <div className="border-t border-stone-100 px-2 py-1.5">
                          <p className="truncate text-[10px] text-stone-500">{src.split("/").pop()}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Micro-components ──────────────────────────────────────────────────────────

function Btn({ title, onClick, children }: { title: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" title={title} onClick={onClick}
      className="flex h-7 min-w-[28px] items-center justify-center rounded-md px-1.5 text-stone-600 transition hover:bg-stone-200 hover:text-stone-900">
      {children}
    </button>
  );
}

function Sep() {
  return <div className="mx-1 h-5 w-px bg-stone-200" />;
}

const ic = "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100";

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

"use client";
import { useState, useCallback, useRef } from "react";
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

const CALLOUT_TYPES = [
  { type: "conseil",      emoji: "💡", label: "Conseil",    bg: "bg-amber-50" },
  { type: "attention",    emoji: "⚠️", label: "Attention",  bg: "bg-orange-50" },
  { type: "interdiction", emoji: "🚫", label: "À éviter",   bg: "bg-red-50" },
  { type: "info",         emoji: "ℹ️", label: "Info",       bg: "bg-blue-50" },
  { type: "astuce",       emoji: "✨", label: "Astuce",     bg: "bg-green-50" },
  { type: "important",    emoji: "📌", label: "Important",  bg: "bg-purple-50" },
];

export function ArticleForm({ initialSlug = "", initialFrontmatter, initialContent = "", isNew = false }: Props) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [slug, setSlug] = useState(initialSlug);
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"edit" | "preview">("edit");

  // Image picker
  const [imagePicker, setImagePicker] = useState(false);
  const [imageMode, setImageMode] = useState<"field" | "insert">("field");
  const [imageField, setImageField] = useState<"image" | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [insertPos, setInsertPos] = useState<number>(0);

  // Callout menu
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

  // ── Toolbar formatting ──────────────────────────────────────────────────────

  const applyFormat = useCallback((type: string, extra?: string) => {
    const ta = textareaRef.current;
    if (!ta) return;

    const start = ta.selectionStart ?? 0;
    const end = ta.selectionEnd ?? 0;
    const sel = content.slice(start, end);
    const before = content.slice(0, start);
    const after = content.slice(end);

    let insert = "";
    let cursorStart = start;
    let cursorLen = 0;

    const placeholder = (label: string) => sel || label;

    switch (type) {
      case "bold":
        insert = `**${placeholder("texte en gras")}**`;
        cursorStart = start + 2;
        cursorLen = placeholder("texte en gras").length;
        break;
      case "italic":
        insert = `*${placeholder("texte en italique")}*`;
        cursorStart = start + 1;
        cursorLen = placeholder("texte en italique").length;
        break;
      case "h2":
        insert = `\n## ${placeholder("Titre de section")}\n`;
        cursorStart = start + 4;
        cursorLen = placeholder("Titre de section").length;
        break;
      case "h3":
        insert = `\n### ${placeholder("Sous-titre")}\n`;
        cursorStart = start + 5;
        cursorLen = placeholder("Sous-titre").length;
        break;
      case "h4":
        insert = `\n#### ${placeholder("Titre 4")}\n`;
        cursorStart = start + 6;
        cursorLen = placeholder("Titre 4").length;
        break;
      case "link": {
        const text = placeholder("texte du lien");
        insert = `[${text}](url)`;
        cursorStart = start + 1;
        cursorLen = text.length;
        break;
      }
      case "ul":
        insert = `\n- ${placeholder("élément de liste")}\n- \n- \n`;
        cursorStart = start + 3;
        cursorLen = placeholder("élément de liste").length;
        break;
      case "quote":
        insert = `\n> ${placeholder("citation ou extrait")}\n`;
        cursorStart = start + 3;
        cursorLen = placeholder("citation ou extrait").length;
        break;
      case "separator":
        insert = `\n\n---\n\n`;
        cursorStart = start + insert.length;
        cursorLen = 0;
        break;
      case "callout": {
        const ct = extra || "conseil";
        const body = `Votre ${ct} ici...`;
        insert = `\n<Callout type="${ct}">\n  ${body}\n</Callout>\n`;
        cursorStart = start + insert.indexOf(body);
        cursorLen = body.length;
        break;
      }
      default:
        return;
    }

    const newContent = before + insert + after;
    setContent(newContent);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(cursorStart, cursorStart + cursorLen);
    }, 0);
  }, [content]);

  // ── Image picker ────────────────────────────────────────────────────────────

  const loadImages = async () => {
    const res = await fetch("/api/admin/images");
    setImages(await res.json());
  };

  const openImageField = async () => {
    setImageMode("field");
    setImageField("image");
    await loadImages();
    setImagePicker(true);
  };

  const openImageInsert = async () => {
    const ta = textareaRef.current;
    setInsertPos(ta?.selectionStart ?? content.length);
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
      insertImageUrl(url, file.name.replace(/\.[^.]+$/, ""));
      setImagePicker(false);
    } else {
      set("image", url);
      await loadImages();
    }
    setUploadingImg(false);
  };

  const insertImageUrl = (src: string, altText = "Image") => {
    const pos = insertPos;
    const newContent = content.slice(0, pos) + `\n![${altText}](${src})\n` + content.slice(pos);
    setContent(newContent);
    setTimeout(() => {
      const ta = textareaRef.current;
      if (!ta) return;
      const newPos = pos + altText.length + src.length + 6;
      ta.focus();
      ta.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const selectImage = (src: string) => {
    if (imageMode === "insert") {
      insertImageUrl(src, "Image");
    } else {
      if (imageField) set(imageField, src);
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
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-stone-200 bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/admin/articles")} className="text-sm text-stone-400 hover:text-stone-700">
            ← Articles
          </button>
          <span className="text-stone-200">|</span>
          <div className="flex gap-1 rounded-lg bg-stone-100 p-0.5 text-sm">
            {(["edit", "preview"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`rounded-md px-3 py-1 font-medium transition ${tab === t ? "bg-white shadow-sm text-stone-900" : "text-stone-500"}`}>
                {t === "edit" ? "Édition" : "Prévisualiser"}
              </button>
            ))}
          </div>
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

      {tab === "preview" ? (
        <div className="flex flex-1 items-center justify-center bg-stone-100">
          <div className="flex flex-col items-center gap-4">
            <p className="text-stone-500">Sauvegardez d'abord, puis ouvrez la prévisualisation :</p>
            <a href={previewUrl} target="_blank" rel="noreferrer"
              className="rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white">
              Ouvrir /{TYPE_PATH[fm.type]}/{slug || "..."} ↗
            </a>
            <p className="text-xs text-stone-400">Le serveur Next.js rechargera automatiquement l'article modifié.</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* ── Left: content editor ── */}
          <div className="flex w-[55%] flex-col border-r border-stone-200">
            {/* Toolbar */}
            <div className="flex shrink-0 flex-wrap items-center gap-0.5 border-b border-stone-100 bg-stone-50 px-3 py-2">
              <Btn title="Gras" onClick={() => applyFormat("bold")}><strong className="text-sm">B</strong></Btn>
              <Btn title="Italique" onClick={() => applyFormat("italic")}><em className="text-sm">I</em></Btn>
              <Sep />
              <Btn title="Titre H2" onClick={() => applyFormat("h2")}>
                <span className="text-xs font-bold">H2</span>
              </Btn>
              <Btn title="Sous-titre H3" onClick={() => applyFormat("h3")}>
                <span className="text-xs font-bold">H3</span>
              </Btn>
              <Btn title="Petit titre H4" onClick={() => applyFormat("h4")}>
                <span className="text-xs font-bold">H4</span>
              </Btn>
              <Sep />
              <Btn title="Liste à puces" onClick={() => applyFormat("ul")}>
                <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
                  <circle cx="2" cy="4" r="1.5"/><rect x="5" y="3" width="10" height="2" rx="1"/>
                  <circle cx="2" cy="8" r="1.5"/><rect x="5" y="7" width="10" height="2" rx="1"/>
                  <circle cx="2" cy="12" r="1.5"/><rect x="5" y="11" width="10" height="2" rx="1"/>
                </svg>
              </Btn>
              <Btn title="Citation" onClick={() => applyFormat("quote")}>
                <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M3 4h1.5v5H3V4zm3 0h1.5v5H6V4zM2 10h4v1H2v-1zm4.5-6H8v5H6.5V4z"/>
                  <rect x="1" y="3" width="2" height="8" rx="1"/>
                </svg>
              </Btn>
              <Btn title="Lien" onClick={() => applyFormat("link")}>
                <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6.5 9.5a3.5 3.5 0 005 0l2-2a3.5 3.5 0 00-5-5l-1 1"/>
                  <path d="M9.5 6.5a3.5 3.5 0 00-5 0l-2 2a3.5 3.5 0 005 5l1-1"/>
                </svg>
              </Btn>
              <Btn title="Ligne de séparation" onClick={() => applyFormat("separator")}>
                <span className="text-xs">—</span>
              </Btn>
              <Sep />
              {/* Image insert */}
              <Btn title="Insérer une image" onClick={openImageInsert}>
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
                    {CALLOUT_TYPES.map(({ type, emoji, label, bg }) => (
                      <button
                        key={type}
                        onClick={() => { applyFormat("callout", type); setShowCalloutMenu(false); }}
                        className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:${bg} hover:opacity-90 transition-colors`}
                      >
                        <span>{emoji}</span>
                        <span className="font-medium text-stone-700">{label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Info bar */}
            <div className="flex items-center justify-between border-b border-stone-100 bg-stone-50 px-4 py-1 text-[11px] text-stone-400">
              <span>Markdown + MDX — les titres ## deviennent H2, <strong>**gras**</strong></span>
              <span>{content.length} car.</span>
            </div>

            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`## Introduction\n\nCommencez à rédiger votre article...\n\n<Callout type="conseil">\n  Un conseil utile ici.\n</Callout>`}
              className="flex-1 resize-none bg-white p-5 font-mono text-sm leading-relaxed text-stone-800 outline-none placeholder:text-stone-300"
              spellCheck
            />
          </div>

          {/* ── Right: frontmatter ── */}
          <div className="flex w-[45%] flex-col overflow-y-auto bg-stone-50">
            <div className="border-b border-stone-100 bg-stone-50 px-4 py-2 text-xs font-medium text-stone-500">Métadonnées</div>
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

              <Field label="Meta description *" hint="120–160 caractères">
                <textarea value={fm.metaDescription} onChange={(e) => set("metaDescription", e.target.value)}
                  rows={3} placeholder="Découvrez les meilleures..." className={ic + " resize-none"} />
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
                    placeholder="/images/articles/mon-image.jpg" className={ic + " flex-1"} />
                  <button type="button" onClick={openImageField}
                    className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-50">
                    📷 Choisir
                  </button>
                </div>
                {fm.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={fm.image} alt={fm.imageAlt} className="mt-2 h-24 w-full rounded-lg object-cover" />
                )}
              </Field>

              <Field label="Alt de l'image">
                <input type="text" value={fm.imageAlt} onChange={(e) => set("imageAlt", e.target.value)}
                  placeholder="Canapé velours vert dans un salon..." className={ic} />
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
                        <button type="button" onClick={() => removeFAQ(i)} className="text-xs text-red-400 hover:text-red-600">
                          Supprimer
                        </button>
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

              {/* Callout cheatsheet */}
              <div className="rounded-xl border border-stone-100 bg-white p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-400">Aide — Callouts disponibles</p>
                <div className="space-y-1.5">
                  {CALLOUT_TYPES.map(({ type, emoji, label }) => (
                    <div key={type} className="flex items-center gap-2 text-xs text-stone-500">
                      <span>{emoji}</span>
                      <code className="rounded bg-stone-100 px-1 font-mono text-[10px]">type="{type}"</code>
                      <span className="text-stone-400">→ {label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Image picker modal ── */}
      {imagePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
          <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
              <h2 className="font-semibold text-stone-900">
                {imageMode === "insert" ? "Insérer une image dans l'article" : "Image principale"}
              </h2>
              <button onClick={() => setImagePicker(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            {/* Upload zone */}
            <div className="px-5 pt-4">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-stone-200 p-4 text-sm text-stone-500 transition hover:border-stone-400 hover:bg-stone-50">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <span className="text-2xl">📤</span>
                <div>
                  <p className="font-medium">{uploadingImg ? "Upload en cours..." : "Uploader depuis mon ordinateur"}</p>
                  <p className="text-xs text-stone-400">L'image sera ajoutée à la photothèque. JPG, PNG, WebP — max 10 Mo</p>
                </div>
              </label>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-5">
              {images.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-4xl">📷</p>
                  <p className="mt-3 text-sm text-stone-400">Aucune image. Uploadez votre première image ci-dessus.</p>
                </div>
              ) : (
                <>
                  <p className="mb-3 text-xs text-stone-400">Cliquez sur une image pour {imageMode === "insert" ? "l'insérer dans l'article" : "la sélectionner"}</p>
                  <div className="grid grid-cols-3 gap-3">
                    {images.map((src) => (
                      <button key={src} onClick={() => selectImage(src)}
                        className="group relative overflow-hidden rounded-xl border-2 border-transparent transition hover:border-stone-900 hover:shadow-md">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="" className="h-32 w-full object-cover" />
                        <div className="absolute inset-0 flex flex-col items-end justify-start bg-gradient-to-b from-black/30 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
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

// ── Shared micro-components ──────────────────────────────────────────────────

function Btn({ title, onClick, children }: { title: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="flex h-7 min-w-[28px] items-center justify-center rounded-md px-1.5 text-stone-600 transition hover:bg-stone-200 hover:text-stone-900"
    >
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

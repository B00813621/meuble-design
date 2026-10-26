"use client";
import { useEffect, useState, useRef } from "react";

export default function ImagesPage() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [dragging, setDragging] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const res = await fetch("/api/admin/images");
    setImages(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const upload = async (files: FileList) => {
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      await fetch("/api/admin/upload", { method: "POST", body: fd });
    }
    await load();
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) upload(e.dataTransfer.files);
  };

  const copy = (src: string) => {
    navigator.clipboard.writeText(src);
    setCopied(src);
    setTimeout(() => setCopied(null), 1500);
  };

  const deleteImage = async (src: string) => {
    if (!confirm(`Supprimer "${src.split("/").pop()}" définitivement ?`)) return;
    setDeleting(src);
    await fetch("/api/admin/images", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: src }),
    });
    await load();
    setDeleting(null);
  };

  const visible = images.filter((src) =>
    !search || src.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Bibliothèque d'images</h1>
          <p className="mt-0.5 text-sm text-stone-400">{images.length} image{images.length > 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
        >
          + Uploader
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && upload(e.target.files)}
        />
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`mb-6 flex cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed py-10 transition ${
          dragging ? "border-stone-400 bg-stone-100" : "border-stone-200 hover:border-stone-300"
        }`}
        onClick={() => fileRef.current?.click()}
      >
        <div className="text-center">
          <p className="text-2xl">🖼️</p>
          <p className="mt-2 text-sm font-medium text-stone-500">
            {uploading ? "Upload en cours..." : "Glissez des images ici ou cliquez pour choisir"}
          </p>
          <p className="mt-1 text-xs text-stone-400">JPG, PNG, WebP, SVG — max 10 Mo</p>
        </div>
      </div>

      {images.length > 6 && (
        <input
          type="search"
          placeholder="Filtrer les images..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-5 w-64 rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-stone-400"
        />
      )}

      {loading && <p className="text-center text-stone-400">Chargement...</p>}

      {!loading && images.length === 0 && (
        <div className="py-16 text-center text-stone-400">
          <p className="text-4xl">📷</p>
          <p className="mt-3 font-medium">Aucune image pour l'instant</p>
          <p className="mt-1 text-sm">Uploadez votre première image ci-dessus.</p>
        </div>
      )}

      {!loading && visible.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {visible.map((src) => (
            <div
              key={src}
              className="group relative overflow-hidden rounded-xl border border-stone-100 bg-white shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={src.split("/").pop()}
                className="h-36 w-full object-cover"
                loading="lazy"
              />
              {/* Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 opacity-0 transition group-hover:opacity-100">
                <button
                  onClick={() => copy(src)}
                  className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-stone-900 hover:bg-stone-100"
                >
                  {copied === src ? "✓ Copié !" : "Copier le chemin"}
                </button>
                <button
                  onClick={() => deleteImage(src)}
                  disabled={deleting === src}
                  className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-60"
                >
                  {deleting === src ? "Suppression..." : "Supprimer"}
                </button>
              </div>
              {/* Filename */}
              <div className="border-t border-stone-100 px-2 py-1.5">
                <p className="truncate text-xs text-stone-500">{src.split("/").pop()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 rounded-xl border border-stone-100 bg-stone-50 p-4 text-sm text-stone-500">
        <strong>💡 Conseil :</strong> Survolez une image pour copier son chemin ou la supprimer définitivement.
      </div>
    </div>
  );
}

import { NextResponse } from "next/server";
import { listImages } from "@/lib/admin";
import fs from "fs";
import path from "path";

export async function GET() {
  return NextResponse.json(listImages());
}

export async function DELETE(req: Request) {
  try {
    const { path: imgPath } = await req.json();
    if (!imgPath || typeof imgPath !== "string" || imgPath.includes("..") || !imgPath.startsWith("/images/")) {
      return NextResponse.json({ error: "Chemin invalide" }, { status: 400 });
    }
    const fullPath = path.join(process.cwd(), "public", imgPath);
    const publicImages = path.join(process.cwd(), "public", "images");
    if (!fullPath.startsWith(publicImages)) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });
    }
    fs.unlinkSync(fullPath);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

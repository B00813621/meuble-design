import { NextResponse } from "next/server";
import { saveUploadedImage } from "@/lib/admin";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml", "image/avif"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: "Type de fichier non supporté" }, { status: 400 });
  }
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Fichier trop grand (max 10 Mo)" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const url = saveUploadedImage(file.name, buffer);
  return NextResponse.json({ url });
}

import { NextResponse } from "next/server";
import { listImages } from "@/lib/admin";

export async function GET() {
  return NextResponse.json(listImages());
}

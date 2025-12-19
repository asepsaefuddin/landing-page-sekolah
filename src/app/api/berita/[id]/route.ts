import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Berita from "@/app/lib/models/Berita";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const berita = await Berita.findById(params.id);
    
    if (!berita) {
      return NextResponse.json({ error: "Berita tidak ditemukan" }, { status: 404 });
    }
    
    return NextResponse.json(berita);
  } catch (error) {
    console.error("GET /api/berita/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch berita" }, { status: 500 });
  }
}
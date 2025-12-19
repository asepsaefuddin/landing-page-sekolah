import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Bookmark from "@/app/lib/models/Bookmark";

export async function GET() {
  await connectDB();
  const data = await Bookmark.find({}).sort({ createdAt: -1 });
  return NextResponse.json({ ok: true, data });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validasi required fields
    const requiredFields = ["judul", "link"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ ok: false, error: `Field ${field} wajib diisi` }, { status: 400 });
      }
    }

    await connectDB();
    const doc = await Bookmark.create({
      judul: body.judul,
      link: body.link,
      deskripsi: body.deskripsi || "",
    });
    
    return NextResponse.json({ ok: true, id: String(doc._id) });
  } catch (err) {
    console.error("POST /api/bookmark error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json({ ok: false, error: "ID tidak ditemukan" }, { status: 400 });
    }

    // Validasi required fields
    const requiredFields = ["judul", "link"];
    for (const field of requiredFields) {
      if (!updateData[field]) {
        return NextResponse.json({ ok: false, error: `Field ${field} wajib diisi` }, { status: 400 });
      }
    }

    await connectDB();
    const doc = await Bookmark.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!doc) {
      return NextResponse.json({ ok: false, error: "Data tidak ditemukan" }, { status: 404 });
    }
    
    return NextResponse.json({ ok: true, data: doc });
  } catch (err) {
    console.error("PUT /api/bookmark error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ ok: false, error: "ID tidak ditemukan" }, { status: 400 });
    }

    await connectDB();
    const doc = await Bookmark.findByIdAndDelete(id);
    if (!doc) {
      return NextResponse.json({ ok: false, error: "Data tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/bookmark error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
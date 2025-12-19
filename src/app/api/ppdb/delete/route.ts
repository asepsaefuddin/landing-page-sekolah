import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { Application } from "@/models/Application";
import { getAdminSession } from "@/app/lib/getSession";
import cloudinary from "cloudinary";
import fs from "node:fs/promises";
import path from "node:path";
import { FlattenMaps } from "mongoose";

export const runtime = "nodejs";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

async function deleteCloudinaryAny(publicId?: string) {
  if (!publicId) return { ok: true, note: "no_public_id" };
  const order: Array<"image" | "raw" | "video"> = ["image", "raw", "video"];
  for (const rt of order) {
    try {
      const res = await cloudinary.v2.uploader.destroy(publicId, {
        resource_type: rt,
        invalidate: true,
      });
      if (res.result === "ok" || res.result === "not found") {
        return { ok: true, rt, result: res.result };
      }
    } catch {
      // coba rt berikutnya
    }
  }
  return { ok: false };
}

export async function DELETE(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json().catch(() => ({}));
    if (!id) {
      return NextResponse.json({ ok: false, error: "ID tidak ditemukan" }, { status: 400 });
    }

    await connectDB();
  const doc = await Application.findById(id).lean() as (FlattenMaps<any> & Required<{ _id: unknown; }> & { __v: number; file_kind?: string; berkas_url?: string; berkas_public_id?: string });
    if (!doc) {
      return NextResponse.json({ ok: false, error: "Data tidak ditemukan" }, { status: 404 });
    }

  let cloudDel: { ok: boolean; rt?: string; result?: string; note?: string } | null = null;
    // Hapus file fisik atau cloud sesuai jenis
    if (doc.file_kind === "pdf" && typeof doc.berkas_url === "string") {
      // contoh berkas_url: "/pdf_uploads/namafile.pdf"
      try {
        const rel = doc.berkas_url.startsWith("/") ? doc.berkas_url.slice(1) : doc.berkas_url;
        const fullPath = path.join(process.cwd(), "public", rel);
        await fs.unlink(fullPath);
      } catch (e) {
        console.warn("Gagal hapus file lokal:", e);
      }
    } else if (doc.file_kind === "image" && doc.berkas_public_id) {
      cloudDel = await deleteCloudinaryAny(doc.berkas_public_id);
    } else {
      // data lama yang belum punya file_kind, fallback hapus cloudinary jika ada
      if (doc.berkas_public_id) {
        cloudDel = await deleteCloudinaryAny(doc.berkas_public_id);
      }
      // kalau punya URL lokal lama, boleh coba hapus juga
      if (typeof doc.berkas_url === "string" && doc.berkas_url.startsWith("/pdf_uploads/")) {
        try {
          const rel = doc.berkas_url.slice(1);
          const fullPath = path.join(process.cwd(), "public", rel);
          await fs.unlink(fullPath);
        } catch (e) {
          console.warn("Gagal hapus file lokal (fallback):", e);
        }
      }
    }

    await Application.findByIdAndDelete(id);

    return NextResponse.json({ ok: true, cloudinary: cloudDel });
  } catch (err) {
    console.error("DELETE /api/ppdb/delete error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

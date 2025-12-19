// src/app/api/ppdb/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/app/lib/db";
import { Application } from "@/models/Application";
import { getAdminSession } from "@/app/lib/getSession";
import cloudinary from "cloudinary";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export const runtime = "nodejs";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const appSchema = z.object({
  nama_siswa: z.string().min(1),
  nisn: z.string().min(1),
  tgl_lahir: z.string().min(1),
  asal_sekolah: z.string().min(1),
  nama_ortu: z.string().min(1),
  no_hp: z.string().min(1),
  alamat: z.string().min(1),
  jalur: z.enum(["reguler", "prestasi", "tahfizh", "afirmasi"]),
});

// helper nama file aman
function safeFileName(originalName: string) {
  const ext = (originalName.split(".").pop() || "").toLowerCase();
  const base = originalName.replace(/\.[^/.]+$/, "");
  const slug = base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const rand = crypto.randomBytes(6).toString("hex");
  return `${slug || "file"}-${Date.now()}-${rand}.${ext}`;
}

// GET: khusus admin (tetap)
export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const data = await Application.find().sort({ created_at: -1 }).lean();
    return NextResponse.json({ ok: true, data });
  } catch (err) {
    console.error("GET /api/ppdb error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

// POST: publik dari form
export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const payload = {
      nama_siswa: String(form.get("nama_siswa") || ""),
      nisn: String(form.get("nisn") || ""),
      tgl_lahir: String(form.get("tgl_lahir") || ""),
      asal_sekolah: String(form.get("asal_sekolah") || ""),
      nama_ortu: String(form.get("nama_ortu") || ""),
      no_hp: String(form.get("no_hp") || ""),
      alamat: String(form.get("alamat") || ""),
      jalur: String(form.get("jalur") || ""),
    };

    const parsed = appSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Data tidak valid" }, { status: 400 });
    }

    // ====== Upload handling ======
    let file_kind: "pdf" | "image" | undefined;
    let berkas_url: string | undefined;
    let berkas_public_id: string | undefined;
    let berkas_resource_type: string | undefined;
    let berkas_format: string | undefined;

    const file = form.get("berkas") as File | null;
    if (file && file.size > 0) {
      const mime = file.type; // contoh: "application/pdf", "image/png"
      const name = (file as any).name ? String((file as any).name) : "berkas";
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

      const isPDF = mime === "application/pdf" || name.toLowerCase().endsWith(".pdf");
      const isImage = mime.startsWith("image/");

      if (isPDF) {
        // Simpan ke /public/pdf_uploads
        const uploadsDir = path.join(process.cwd(), "public", "pdf_uploads");
        await fs.mkdir(uploadsDir, { recursive: true });

        const withExt = name.toLowerCase().endsWith(".pdf") ? name : `${name}.pdf`;
        const safeName = safeFileName(withExt);
        const filePath = path.join(uploadsDir, safeName);
        await fs.writeFile(filePath, buffer);

        file_kind = "pdf";
        berkas_url = `/pdf_uploads/${safeName}`; // bisa diakses langsung
        berkas_resource_type = "raw";
        berkas_format = "pdf";
      } else if (isImage) {
        // Upload ke Cloudinary (khusus image)
        const result: { secure_url: string; public_id: string; resource_type: string; format: string } = await new Promise((resolve, reject) => {
          const stream = cloudinary.v2.uploader.upload_stream(
            {
              folder: process.env.CLOUDINARY_UPLOAD_FOLDER || "ppdb_uploads",
              resource_type: "image",
            },
            (err, res) => (err ? reject(err) : resolve(res as { secure_url: string; public_id: string; resource_type: string; format: string }))
          );
          stream.end(buffer);
        });

        file_kind = "image";
        berkas_url = result.secure_url;
        berkas_public_id = result.public_id;
        berkas_resource_type = result.resource_type;
        berkas_format = result.format;              
      } else {
        return NextResponse.json(
          { ok: false, error: "Hanya boleh upload Gambar (JPG/PNG/WEBP) atau PDF." },
          { status: 400 }
        );
      }
    }

    await connectDB();
    const doc = await Application.create({
      ...parsed.data,
      file_kind,
      berkas_url,
      berkas_public_id,
      berkas_resource_type,
      berkas_format,
    });

    return NextResponse.json({ ok: true, id: String(doc._id) }, { status: 201 });
  } catch (err) {
    console.error("POST /api/ppdb error:", err);
    if (
      String((err as Error)?.message || "").includes("ECONNREFUSED") ||
      String((err as Error)?.name || "") === "MongooseServerSelectionError"
    ) {
      return NextResponse.json(
        { ok: false, error: "Gagal konek MongoDB. Cek MONGODB_URI & network." },
        { status: 500 }
      );
    }
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

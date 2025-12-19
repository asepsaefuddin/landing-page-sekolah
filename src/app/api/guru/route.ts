import { NextResponse, NextRequest } from "next/server";
import dbConnect from "../../lib/mongodb";
import Guru from "@/models/Guru";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to get correct resource type
function getResourceType(mimeType: string): 'image' | 'video' | 'raw' | 'auto' {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  return 'raw';
}

// Helper to get file extension from mime type
function getFormatFromMimeType(mimeType: string): string | undefined {
  const mimeToFormat: Record<string, string> = {
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/zip': 'zip',
  };
  return mimeToFormat[mimeType];
}

// Add a robust public_id extractor (handles /raw|image/upload, version, and extensions)
function extractPublicId(url: string): string {
  try {
    const { pathname } = new URL(url);
    const parts = pathname.split('/').filter(Boolean);
    const uploadIdx = parts.findIndex(p => p === 'upload');
    const publicIdParts = parts.slice(uploadIdx + 2);
    if (publicIdParts.length === 0) return "";
    const last = publicIdParts[publicIdParts.length - 1];
    publicIdParts[publicIdParts.length - 1] = last.includes('.') ? last.split('.')[0] : last;
    return publicIdParts.join('/');
  } catch {
    const urlParts = url.split('/');
    const publicIdWithExt = urlParts.slice(-2).join('/');
    return publicIdWithExt.split('.')[0];
  }
}

export async function GET() {
  try {
    await dbConnect();
    const data = await Guru.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ ok: true, data });
  } catch (err) {
    console.error("GET /api/guru error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const formData = await req.formData();
    
    const requiredFields = ["nama", "nip", "mata_pelajaran", "no_hp"];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        return NextResponse.json({ ok: false, error: `Field ${field} wajib diisi` }, { status: 400 });
      }
    }

    let berkas_url = "";
    let berkas_type = "";
    const file = formData.get("berkas") as File | null;

    if (file && file.size > 0) {
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString('base64');
        const dataUri = `data:${file.type};base64,${base64}`;
        const resourceType = getResourceType(file.type);

        const result = await cloudinary.uploader.upload(dataUri, {
          folder: 'ppdb_uploads',
          resource_type: resourceType,
          use_filename: false,
          unique_filename: true,
        });

        berkas_url = result.secure_url;
        berkas_type = file.type;
      } catch (uploadError) {
        console.error("Upload error:", uploadError);
        return NextResponse.json({ ok: false, error: "Gagal upload file" }, { status: 500 });
      }
    }

    const doc = await Guru.create({
      nama: formData.get("nama"),
      nip: formData.get("nip"),
      mata_pelajaran: formData.get("mata_pelajaran"),
      no_hp: formData.get("no_hp"),
      berkas_url,
      berkas_type,
    });
    
    return NextResponse.json({ ok: true, id: String(doc._id) });
  } catch (err) {
    console.error("POST /api/guru error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const formData = await req.formData();
    const id = formData.get("id") as string;
    
    if (!id) {
      return NextResponse.json({ ok: false, error: "ID tidak ditemukan" }, { status: 400 });
    }

    const requiredFields = ["nama", "nip", "mata_pelajaran", "no_hp"];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        return NextResponse.json({ ok: false, error: `Field ${field} wajib diisi` }, { status: 400 });
      }
    }

    const existingDoc = await Guru.findById(id);
    if (!existingDoc) {
      return NextResponse.json({ ok: false, error: "Data tidak ditemukan" }, { status: 404 });
    }

    let berkas_url = existingDoc.berkas_url;
    let berkas_type = existingDoc.berkas_type;
    const file = formData.get("berkas") as File | null;

    if (file && file.size > 0) {
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString('base64');
        const dataUri = `data:${file.type};base64,${base64}`;
        const resourceType = getResourceType(file.type);

        const result = await cloudinary.uploader.upload(dataUri, {
          folder: 'ppdb_uploads',
          resource_type: resourceType,
          use_filename: false,
          unique_filename: true,
        });

        berkas_url = result.secure_url;
        berkas_type = file.type;

        // Delete previous Cloudinary file if exists
        if (existingDoc.berkas_url) {
          try {
            const publicId = extractPublicId(existingDoc.berkas_url);
            const oldResourceType = getResourceType(existingDoc.berkas_type || 'application/pdf');
            await cloudinary.uploader.destroy(publicId, { resource_type: oldResourceType });
            console.log("Deleted previous cloudinary file:", publicId);
          } catch (e) {
            console.warn("Gagal hapus file lama di Cloudinary:", e);
          }
        }
      } catch (uploadError) {
        console.error("Upload error:", uploadError);
        return NextResponse.json({ ok: false, error: "Gagal upload file" }, { status: 500 });
      }
    }

    const doc = await Guru.findByIdAndUpdate(id, {
      nama: formData.get("nama"),
      nip: formData.get("nip"),
      mata_pelajaran: formData.get("mata_pelajaran"),
      no_hp: formData.get("no_hp"),
      berkas_url,
      berkas_type,
    }, { new: true });
    
    return NextResponse.json({ ok: true, data: doc });
  } catch (err) {
    console.error("PUT /api/guru error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { id } = await req.json();
    
    if (!id) {
      return NextResponse.json({ ok: false, error: "ID tidak ditemukan" }, { status: 400 });
    }

    const doc = await Guru.findById(id);
    if (!doc) {
      return NextResponse.json({ ok: false, error: "Data tidak ditemukan" }, { status: 404 });
    }

    // Delete Cloudinary file if exists
    if (doc.berkas_url) {
      try {
        const publicId = extractPublicId(doc.berkas_url);
        const resourceType = getResourceType(doc.berkas_type || 'application/pdf');
        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        console.log("Deleted cloudinary file for guru:", publicId);
      } catch (e) {
        console.warn("Error while deleting guru file:", e);
      }
    }

    await Guru.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/guru error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
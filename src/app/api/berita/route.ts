import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Berita from "@/app/lib/models/Berita";
import mongoose from "mongoose";

export async function GET() {
  try {
    console.log("API /api/berita GET called");
    await connectDB();
    console.log("Database connected successfully");
    
    // Get all documents from beritas collection using raw MongoDB query
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection not established");
    }
    
    const collection = db.collection('beritas');
    const data = await collection.find({}).sort({ createdAt: -1 }).toArray();
    console.log("Berita data fetched:", data.length, "items");
    
    // Transform data to match expected interface
    const transformedData = data.map(item => ({
      ...item,
      _id: item._id.toString(),
      // Map old field names to new ones for compatibility
      tanggalPublikasi: item.tanggalPublikasi || item.tanggal || item.createdAt,
      kategori: item.kategori || "umum",
      gambar: item.gambar || "",
      tags: item.tags || [],
      status: item.status || "published"
    }));
    
    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("GET /api/berita error:", error);
    return NextResponse.json({ error: "Failed to fetch berita" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    console.log("=== POST /api/berita START ===");
    
    // Parse request body
    let body;
    try {
      body = await req.json();
      console.log("Request body parsed:", body);
    } catch (e) {
      console.error("JSON parse error:", e);
      return NextResponse.json({ ok: false, error: "Invalid JSON in request body" }, { status: 400 });
    }
    
    // Validasi required fields
    const requiredFields = ["judul", "konten", "penulis"];
    const missingFields = [];
    
    for (const field of requiredFields) {
      if (!body[field] || String(body[field]).trim() === "") {
        missingFields.push(field);
      }
    }
    
    if (missingFields.length > 0) {
      console.log(`Validation error: Missing fields: ${missingFields.join(", ")}`);
      console.log("Received body:", JSON.stringify(body, null, 2));
      return NextResponse.json({ 
        ok: false, 
        error: `Field(s) wajib diisi: ${missingFields.join(", ")}` 
      }, { status: 400 });
    }

    // Connect to database
    console.log("Connecting to database...");
    try {
      await connectDB();
      console.log("Database connected successfully");
    } catch (dbError) {
      console.error("Database connection failed:", dbError);
      return NextResponse.json({ ok: false, error: "Database connection failed" }, { status: 500 });
    }
    
    // Prepare data for saving
    const tanggalPublikasi = body.tanggalPublikasi ? new Date(body.tanggalPublikasi) : new Date();
    
    const beritaData = {
      judul: body.judul.trim(),
      konten: body.konten.trim(),
      kategori: body.kategori?.trim() || "umum",
      gambar: body.gambar?.trim() || "",
      penulis: body.penulis.trim(),
      tanggalPublikasi: tanggalPublikasi,
      tanggal: tanggalPublikasi.toISOString(), // Backward compatibility
      tags: Array.isArray(body.tags) ? body.tags : [],
      status: body.status || "published",
    };
    
    console.log("Creating berita with data:", beritaData);
    
    // Save to database
    let doc;
    try {
      doc = await Berita.create(beritaData);
      console.log("Berita created successfully with ID:", doc._id);
    } catch (saveError) {
      console.error("Error saving berita:", saveError);
      if (saveError instanceof Error) {
        return NextResponse.json({ ok: false, error: `Save error: ${saveError.message}` }, { status: 500 });
      }
      return NextResponse.json({ ok: false, error: "Unknown save error" }, { status: 500 });
    }
    
    console.log("=== POST /api/berita SUCCESS ===");
    return NextResponse.json({ ok: true, id: String(doc._id) });
    
  } catch (err) {
    console.error("=== POST /api/berita ERROR ===");
    console.error("Error type:", err?.constructor?.name);
    console.error("Error message:", err instanceof Error ? err.message : String(err));
    console.error("Error stack:", err instanceof Error ? err.stack : "No stack trace");
    
    return NextResponse.json({ 
      ok: false, 
      error: `Server error: ${err instanceof Error ? err.message : "Unknown error"}` 
    }, { status: 500 });
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
    const requiredFields = ["judul", "konten", "penulis"];
    for (const field of requiredFields) {
      if (!updateData[field]) {
        return NextResponse.json({ ok: false, error: `Field ${field} wajib diisi` }, { status: 400 });
      }
    }

    await connectDB();
    
    // Prepare update data with proper field mapping
    const finalUpdateData = {
      judul: updateData.judul,
      konten: updateData.konten,
      kategori: updateData.kategori || "umum",
      gambar: updateData.gambar || "",
      penulis: updateData.penulis,
      tanggalPublikasi: updateData.tanggalPublikasi || new Date(),
      tags: updateData.tags || [],
      status: updateData.status || "published",
    };
    
    const doc = await Berita.findByIdAndUpdate(id, finalUpdateData, { new: true });
    
    if (!doc) {
      return NextResponse.json({ ok: false, error: "Data tidak ditemukan" }, { status: 404 });
    }
    
    return NextResponse.json({ ok: true, data: doc });
  } catch (err) {
    console.error("PUT /api/berita error:", err);
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
    const doc = await Berita.findByIdAndDelete(id);
    if (!doc) {
      return NextResponse.json({ ok: false, error: "Data tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/berita error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
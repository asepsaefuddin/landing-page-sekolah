import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validasi file type - hanya PDF, gambar, dan DOCX
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg", 
      "image/png",
      "image/gif",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
      "application/msword" // DOC (legacy)
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: "File harus berupa PDF, gambar (JPG, PNG, GIF), atau dokumen Word (DOCX)" 
      }, { status: 400 });
    }

    // Validasi ukuran file - maksimal 10MB
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: "Ukuran file maksimal 10MB" 
      }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}_${originalName}`;
    
    // Tentukan folder berdasarkan jenis file
    let subfolder = "others";
    if (file.type.startsWith("image/")) {
      subfolder = "images";
    } else if (file.type === "application/pdf") {
      subfolder = "pdf";
    } else if (file.type.includes("word") || file.type.includes("document")) {
      subfolder = "documents";
    }

    // Path untuk menyimpan file
    const uploadDir = join(process.cwd(), "public", "uploads", "form-ppdb", subfolder);
    const filePath = join(uploadDir, fileName);

    // Buat folder jika belum ada
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Convert file to buffer dan simpan
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Return URL yang bisa diakses
    const fileUrl = `/uploads/form-ppdb/${subfolder}/${fileName}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: fileName,
      originalName: file.name,
      fileSize: file.size,
      fileType: file.type,
      subfolder: subfolder
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
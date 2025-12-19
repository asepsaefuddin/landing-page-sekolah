import { NextResponse } from "next/server";
import { readdir, stat } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "form-ppdb");
    
    try {
      const files = await readdir(uploadsDir);
      const fileDetails = await Promise.all(
        files.map(async (filename) => {
          const filePath = path.join(uploadsDir, filename);
          const stats = await stat(filePath);
          return {
            filename,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime,
            url: `/uploads/form-ppdb/${filename}`
          };
        })
      );
      
      return NextResponse.json({
        success: true,
        files: fileDetails.sort((a, b) => b.modified.getTime() - a.modified.getTime())
      });
    } catch (dirError) {
      return NextResponse.json({
        success: true,
        files: [],
        message: "Upload directory not found or empty"
      });
    }
  } catch (error) {
    console.error("Error reading uploads directory:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to read uploads directory"
    }, { status: 500 });
  }
}
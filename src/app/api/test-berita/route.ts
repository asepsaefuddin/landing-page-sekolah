import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Berita from "@/app/lib/models/Berita";

export async function POST(req: Request) {
  try {
    console.log("=== TEST BERITA API START ===");
    
    // Test 1: Parse request body
    const body = await req.json();
    console.log("1. Request body parsed:", body);
    
    // Test 2: Database connection
    console.log("2. Attempting database connection...");
    await connectDB();
    console.log("2. Database connected successfully");
    
    // Test 3: Create simple test data
    console.log("3. Creating test berita...");
    const testData = {
      judul: "Test Berita API",
      konten: "Konten test",
      penulis: "Admin Test",
      kategori: "umum"
    };
    console.log("3. Test data:", testData);
    
    // Test 4: Save to database
    console.log("4. Saving to database...");
    const doc = await Berita.create(testData);
    console.log("4. Saved successfully with ID:", doc._id);
    
    console.log("=== TEST BERITA API SUCCESS ===");
    return NextResponse.json({ 
      success: true, 
      id: String(doc._id),
      message: "Test berita created successfully" 
    });
    
  } catch (error) {
    console.error("=== TEST BERITA API ERROR ===");
    console.error("Error type:", error?.constructor?.name);
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
    
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error),
      errorType: error?.constructor?.name || "Unknown"
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Test endpoint ready for POST requests" });
}
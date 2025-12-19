import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import mongoose from "mongoose";

export async function GET() {
  try {
    // Test database connection
    await connectDB();
    
    // Get connection status
    const connectionState = mongoose.connection.readyState;
    const connectionStates = {
      0: 'disconnected',
      1: 'connected', 
      2: 'connecting',
      3: 'disconnecting'
    };

    console.log("Database connection state:", connectionStates[connectionState as keyof typeof connectionStates]);
    
    if (!mongoose.connection.db) {
      throw new Error("Database connection not established");
    }
    
    // Try to get collections info
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Available collections:", collections.map(c => c.name));
    
    // Check if beritas collection exists and get count
    const beritasCollection = mongoose.connection.db.collection('beritas');
    const count = await beritasCollection.countDocuments();
    console.log("Beritas collection document count:", count);
    
    // Get sample documents
    const sampleDocs = await beritasCollection.find({}).limit(3).toArray();
    console.log("Sample documents:", sampleDocs);
    
    return NextResponse.json({
      status: "success",
      connectionState: connectionStates[connectionState as keyof typeof connectionStates],
      collections: collections.map(c => c.name),
      beritasCount: count,
      sampleDocs: sampleDocs
    });
    
  } catch (error) {
    console.error("Database test error:", error);
    return NextResponse.json({ 
      error: "Database connection failed", 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
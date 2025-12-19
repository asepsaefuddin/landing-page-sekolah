import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI in env");
}

declare global {
  var _mongooseConn: Promise<typeof mongoose> | undefined;
}

export async function connectDB() {
  try {
    if (!global._mongooseConn) {
      console.log("[Mongo] Creating new connection...");
      global._mongooseConn = mongoose
        .connect(MONGODB_URI, { 
          dbName: "mts_ppdb",
          serverSelectionTimeoutMS: 10000, // 10 second timeout
          socketTimeoutMS: 45000, // 45 second socket timeout
        })
        .then((c) => { 
          console.log("[Mongo] Connected successfully"); 
          return c; 
        })
        .catch((e) => { 
          console.error("[Mongo] Connection error:", e); 
          global._mongooseConn = undefined; // Reset on error
          throw e; 
        });
    } else {
      console.log("[Mongo] Reusing existing connection");
    }
    return await global._mongooseConn;
  } catch (error) {
    console.error("[Mongo] connectDB failed:", error);
    throw error;
  }
}

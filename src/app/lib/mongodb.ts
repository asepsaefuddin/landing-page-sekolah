import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please set MONGODB_URI in your .env.local");
}

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  listenersAdded?: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: Cached | undefined;
}

const cached: Cached = global._mongooseCache || { conn: null, promise: null, listenersAdded: false };
global._mongooseCache = cached;

export default async function dbConnect() {
  // Sudah terhubung
  if (cached.conn && mongoose.connection.readyState === 1) return cached.conn;

  // Sedang menghubungkan
  if (cached.promise && mongoose.connection.readyState === 2) {
    cached.conn = await cached.promise;
    return cached.conn;
  }

  // Mulai koneksi baru (retry-safe)
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 20000,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).catch((err) => {
      // Reset agar panggilan berikutnya bisa mencoba lagi
      cached.promise = null;
      throw err;
    });
  }

  cached.conn = await cached.promise;

  // Pasang listener sekali untuk sinkronisasi cache
  if (!cached.listenersAdded) {
    mongoose.connection.on("disconnected", () => {
      cached.conn = null;
      cached.promise = null;
    });
    cached.listenersAdded = true;
  }

  return cached.conn;
}
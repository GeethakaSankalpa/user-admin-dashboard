import mongoose from "mongoose";

/**
 * This function connects to MongoDB using Mongoose.
 * It ensures we reuse the existing connection if already established (important for Next.js hot reload).
 */
const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is not defined in .env.local");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "user_admin_dashboard_db",
        bufferCommands: false,
      })
      .then((mongoose) => {
        console.log("✅ MongoDB Connected Successfully");
        return mongoose;
      })
      .catch((error) => {
        console.error("❌ MongoDB Connection Failed:", error);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

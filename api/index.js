import mongoose from "mongoose";
import app from "../server/app.js";

let cached = global.__hireflowMongo;
if (!cached) {
  cached = global.__hireflowMongo = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI not set");
    mongoose.set("strictQuery", true);
    cached.promise = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 45000,
      })
      .then((m) => m.connection);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.error("DB connect failed:", err.message);
    return res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
  return app(req, res);
}

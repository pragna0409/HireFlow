import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI is not defined in environment");
    process.exit(1);
  }

  mongoose.set("strictQuery", true);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });
    console.log(
      `MongoDB connected: ${conn.connection.host} | db: ${conn.connection.name}`
    );
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
  });
  mongoose.connection.on("error", (err) => {
    console.error("MongoDB error:", err.message);
  });
};

export default connectDB;

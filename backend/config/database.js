import mongoose from "mongoose";

export const connectDatabase = async () => {
  mongoose.connection.on("connected", () => {
    console.log("✅ MongoDB connected:", mongoose.connection.host);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️  MongoDB disconnected");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("🔄 MongoDB reconnected");
  });

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.log("mongodb connection failed", error.message);
    process.exit(1);
  }
};

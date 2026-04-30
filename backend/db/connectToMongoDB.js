import mongoose from "mongoose";

const connectToMongoDB = async () => {
  try {
    const mongoUrl =
      process.env.MONGO_DB_URL?.trim() || "mongodb://localhost:27017/chatty";

    await mongoose.connect(mongoUrl);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB", error.message);
  }
};

export default connectToMongoDB;

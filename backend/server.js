// Import necessary modules and packages
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";
import cors from "cors";

// Load environment variables from .env file
dotenv.config();

// Resolve the directory name
const __dirname = path.resolve();
// Set the port from environment variables or default to 5000
const PORT = process.env.PORT || 5000;

// Configure CORS to allow requests from the specified origin
app.use(
  cors({
    origin: "https://chatty-m3ui.onrender.com/",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Middleware to parse JSON payloads and cookies
app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use(cookieParser());

// Define routes for authentication, messages, and users
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, "/frontend/dist")));

// Handle all other routes by serving the frontend's index.html file
app.get("*", (req, res) => {
  res.json({ message: "Welcome to Chatty!" });
});

// Start the server and connect to MongoDB
server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server Running on port ${PORT}`);
});

import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

// Debugging: Log environment variables to verify they are loaded correctly
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "Not Loaded");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

import authRouter from "./routers/auth.route.js";
app.use("/api/auth", authRouter);

import noteRouter from "./routers/note.route.js";
app.use("/api/note", noteRouter);

import otpRouter from "./routers/otp.route.js";
app.use("/api/otp", otpRouter);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database Successfully connected..");
  })
  .catch((err) => {
    console.log(`error connecting database..`);
  });

const PORT = process.env.PORT;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server is up and running on port: ${PORT}`);
});

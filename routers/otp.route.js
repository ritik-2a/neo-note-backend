import express from "express";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Temporary OTP storage (replace with DB for production)
const otpStore = {};

// Nodemailer Transporter Setup
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // Use 465 for secure connections
  secure: false, // Set to true for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use App Password if using Gmail
  },
  debug: true, // Enable debug output
  logger: true, // Log information to console
});

// Generate OTP Function
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

/** ✅ Send OTP via Email */
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  otpStore[email] = { otp, expires: Date.now() + 300000 }; // Expires in 5 min

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It expires in 5 minutes.`,
    });
    res.json({ success: true, message: "OTP sent to email." });
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    res.status(500).json({ success: false, error: "Error sending OTP." });
  }
});

/** ✅ Verify OTP */
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  const stored = otpStore[email];

  if (!stored || stored.otp !== otp || Date.now() > stored.expires) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid or expired OTP." });
  }

  delete otpStore[email]; // Remove OTP after verification
  res.json({ success: true, message: "OTP verified successfully!" });
});

export default router;

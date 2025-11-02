import express from "express";
import crypto from "crypto";
import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";

dotenv.config();

const router = express.Router();

// Temporary OTP storage (replace with DB for production)
const otpStore = {};

// SendGrid Mailer Setup
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Generate OTP Function
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

/** ✅ Send OTP via Email using SendGrid */
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  otpStore[email] = { otp, expires: Date.now() + 300000 }; // Expires in 5 min

  const msg = {
    to: email,
    from: process.env.EMAIL_USER, // Verified sender
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It expires in 5 minutes.`,
  };

  try {
    await sgMail.send(msg);
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

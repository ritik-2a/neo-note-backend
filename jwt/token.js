import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const generateTokenAndSaveInCookies = async (userId, name, res) => {
  const token = jwt.sign({ userId, name }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true, // Prevents client-side access
    secure: true, // Ensures cookies are sent only over HTTPS
    sameSite: "None", // Required for cross-site cookies
  });

  await User.findByIdAndUpdate(userId, { token });
  return token;
};

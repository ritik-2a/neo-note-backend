import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const generateTokenAndSaveInCookies = async (userId, name, res) => {
  const token = jwt.sign({ userId, name }, process.env.JWT_SECRET);
  res.cookie("jwt", token, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });

  await User.findByIdAndUpdate(userId, { token });
  return token;
};

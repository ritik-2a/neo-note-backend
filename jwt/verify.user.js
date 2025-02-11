import jwt, { decode } from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyUser = async (req, res, next) => {
  const token = req.cookies.jwt; // Assuming the token is stored under the 'token' key
  if (!token) {
    res.status(400).json({ errors: "Unauthraised Access" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId);
  } catch (error) {
    res.status(401).json({ errors: "" + error });
  }

  next();
};

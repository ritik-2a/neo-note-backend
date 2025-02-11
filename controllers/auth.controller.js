import bcrypt from "bcrypt"; // OR "bcrypt" if using bcrypt with ES modules
import User from "../models/user.model.js";

import { generateTokenAndSaveInCookies } from "../jwt/token.js";

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        errors: "Please fill all the details..",
      });
    }

    if (password.length < 4) {
      // Fixed condition
      return res.status(400).json({
        success: false,
        errors: "Password must be at least 8 characters long.",
      });
    }

    const existUser = await User.findOne({ email });

    if (existUser) {
      return res.status(400).json({
        success: false,
        errors: "User already exists!",
      });
    }

    const bcryptPassword = await bcrypt.hash(password, 10);

    await User.create({ username, email, password: bcryptPassword });

    const newU = await User.findOne({ email });
    await generateTokenAndSaveInCookies(newU._id, username, res);

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      errors: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ errors: "Please fill all the details." });
    }

    // Find the user by email and include the password field
    // const user = await User.findOne({ email }).select("+password"); OR
    const user = await User.findOne({ email });

    // If user is not found, send error response
    if (!user) {
      return res.status(401).json({ errors: "User not found" });
    }

    // Compare the entered password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If the password is invalid, return error response
    if (!isPasswordValid) {
      return res.status(401).json({ errors: "Invalid Credentials" });
    }

    // Generate token and set it in cookies
    const token = await generateTokenAndSaveInCookies(
      user._id,
      user.username,
      res
    );

    // Return success response
    return res.status(200).json({ message: "Successfully logged in", user });
  } catch (error) {
    // Return a more descriptive error message
    return res
      .status(500)
      .json({ errors: error.message || "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", {
      Path: "/",
    });
    return res.status(200).json({ message: "Successfully Logout" });
  } catch (error) {
    return res.status(400).json({ errors: `${error.message}` });
  }
};

import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { verifyRefreshToken } from "../utils/jwt"; // Added missing import for verifyRefreshToken
import User from "../models/User";
import dotenv from "dotenv";
dotenv.config();

// REGISTER
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, fullName, email, phone, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      fullName,
      email,
      phone,
      password: hashedPassword,
      role,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
};

// LOGIN
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Optional: Store refresh token in DB or httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // or "none" if frontend/backend run on different domains
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // or "none" if frontend/backend run on different domains
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

//User is me
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("userId in getMe");
    const userId = req.currentUser?.id;
    console.log(userId, "userId in getMe");

    if (!userId) {
      console.log("Unauthorized access attempt");
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
    return;
  }
};
// LOGOUT
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

// REFRESH TOKEN

export const refresh = async (req: Request, res: Response): Promise<void> => {
  // Removed 'next' parameter as it was unused
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    // Fixed type error by ensuring the function returns void
    res.sendStatus(401);
    return;
  }

  try {
    const payload = verifyRefreshToken(refreshToken) as any; // Fixed missing function by importing verifyRefreshToken
    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== refreshToken) {
      // Fixed type error by ensuring the function returns void
      res.sendStatus(403);
      return;
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    user.refreshToken = newRefreshToken;
    await user.save();

    res
      .cookie("accessToken", newAccessToken, { httpOnly: true })
      .cookie("refreshToken", newRefreshToken, { httpOnly: true })
      .json({ accessToken: newAccessToken });
  } catch {
    // Fixed type error by ensuring the function returns void
    res.sendStatus(403);
  }
};

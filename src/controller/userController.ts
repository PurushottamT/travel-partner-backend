import { Request, Response } from "express";
import User, { UserRole } from "../models/Users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate JWT Token
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

// Ensure the global augmentation is in a separate types file
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
      };
    }
  }
}

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { username, fullName, email, phoneNumber, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      username,
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      role: role || UserRole.USER, // Default role is "user"
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const user = await User.findById(req.user?.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.fullName = req.body.fullName || user.fullName;
    if (req.body.phoneNumber !== undefined) {
      user.phoneNumber = req.body.phoneNumber;
    }
    user.profileImage = req.body.profileImage || user.profileImage;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    await user.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

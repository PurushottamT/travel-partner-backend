import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/generateToken";
import { UserPayload } from "../types/UserPayload";
import User from "../models/Users";

const router = express.Router();

// Start Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req: express.Request, res: express.Response): void => {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: "Unauthorized: User not found" });
      return;
    }
    const userPayload: UserPayload = {
      _id: user.id, // Use 'id' instead of '_id'
      role: user.role,
    };
    const { accessToken, refreshToken } = generateToken(userPayload);
    res.redirect(`${process.env.APP_URL}/auth-success?token=${accessToken}`);
  }
);

router.post(
  "/refresh-token",
  async (req: express.Request, res: express.Response): Promise<void> => {
    const reqUser = req.user;
    if (!reqUser) {
      res.status(401).json({ message: "Unauthorized: User not found" });
      return;
    }
    const userPayload: UserPayload = {
      _id: reqUser.id, // Use 'id' instead of '_id'
      role: reqUser.role,
    };
    const token = req.cookies.refreshToken;
    if (!token) res.status(401).json({ message: "No refresh token provided" });
    try {
      const decode: any = jwt.verify(token, process.env.REFRESH_TOKEN!);
      const user = await User.findById(decode.id);
      if (!user) res.status(401).json({ message: "User not found" });

      const accessToken = jwt.sign(userPayload, process.env.JWT_SECRET!, {
        expiresIn: "15m",
      });
      res.json(accessToken);
    } catch (error) {
      console.error("Refresh failed:", error);
      res.status(401).json({ message: "Invalid refresh token" });
    }
  }
);

router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.json({ message: "Logged out" });
});

export default router;

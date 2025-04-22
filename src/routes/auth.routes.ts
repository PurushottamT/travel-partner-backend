import express from "express";
import passport from "passport";
import {
  login,
  logout,
  refresh,
  register,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/refresh", refresh);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    res.json({ message: "Google login success", user: req.user });
  }
);

export default router;

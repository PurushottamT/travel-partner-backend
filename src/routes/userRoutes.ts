import express from "express";
import { registerUser, updateUserProfile } from "../controller/userController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// @route   POST /api/users/register
// @access  Public
router.post("/register", registerUser);

// @route   PUT /api/users/profile
// @access  Private
router.put("/profile", protect, updateUserProfile);

export default router;

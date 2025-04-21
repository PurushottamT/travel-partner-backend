import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { UserRole } from "../models/Users";

// Generic ownership checker
export const checkOwnership = (
  Model: mongoose.Model<any>,
  key: string = "createdBy"
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params; // ID of resource (e.g. /packages/:id)
      const user =
        req.user && "_id" in req.user ? (req.user as { _id: string }) : null; // Safely cast user to include _id

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const resource = await Model.findById(id);

      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }

      // Check if the current user is the owner
      if (resource[key].toString() !== user._id) {
        // Ensure user._id is a string
        return res
          .status(403)
          .json({ message: "Forbidden: You do not own this resource" });
      }

      // Pass resource to req object if needed in controller
      req["resource"] = resource;

      next();
    } catch (err) {
      console.error("Ownership check failed:", err);
      res.status(500).json({ message: "Server error" });
    }
  };
};

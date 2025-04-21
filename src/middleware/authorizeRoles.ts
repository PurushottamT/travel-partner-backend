import { Request, Response, NextFunction } from "express";
import { UserRole } from "../models/Users";

// Middleware to check role
export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req["user"] as { id: string; role: UserRole };

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    next();
  };
};

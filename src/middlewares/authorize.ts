import { Request, Response, NextFunction } from "express";
import { Role } from "../models/User";

export const authorize =
  (...roles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const currentUser = req["currentUser"];
    if (!currentUser || !roles.includes(currentUser.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.cookies["accessToken"] || req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access token missing" });

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
    if (typeof decoded === "object" && "id" in decoded && "role" in decoded) {
      req.currentUser = decoded as { id: string; role: string }; // Replace 'Role' with 'string' or import/define 'Role'
    } else {
      throw new Error("Invalid token payload");
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

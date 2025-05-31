// src/middlewares/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Request interface
interface DecodedToken {
  id: string;
  role: string;
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token =
      req.cookies?.accessToken ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      res.status(401).json({ message: "Access token missing" });
      return;
    }
    console.log("Received token:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    console.log("Decoded token:", decoded);
    // @ts-ignore - extend request
    req.currentUser = {
      id: decoded.id,
      role: decoded.role,
    };
    console.log("Authenticated user:", req.currentUser);

    return next(); // ✅ proceed
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
    return;
  }
};

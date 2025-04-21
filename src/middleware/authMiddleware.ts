import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/Users";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
      };

      const user = await User.findById(decoded.id);
      if (!user) {
        res.status(401).json({ message: "User not found" });
        return;
      }

      req.user = { id: user.id, role: user.role }; // Attach user ID and role to the request
      if (!user) {
        res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

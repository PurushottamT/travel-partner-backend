import { Request, Response, NextFunction } from "express";

export const ownership =
  (getOwnerId: (req: Request) => string) =>
  (req: Request, res: Response, next: NextFunction) => {
    const currentUser = req["currentUser"];
    const ownerId = getOwnerId(req);

    if (
      !currentUser ||
      (currentUser.id !== ownerId && currentUser.role !== "super-admin")
    ) {
      return res.status(403).json({ message: "Not owner" });
    }

    next();
  };

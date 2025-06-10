import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../../models/User";
import APIError from "../../utils/APIError";
import Certification from "../../models/profile/Certification";

export const createCertification = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username } = req.params;
    const user = (await User.findOne({ username })) as IUser;
    if (!user) throw new APIError("User not found", 404);

    if (!req.user || user._id !== req.currentUser?.id)
      throw new APIError("Forbidden", 403);

    const existing = await Certification.findOne({ userId: user._id });
    if (existing) throw new APIError("Certification already exists", 400);

    const data = { ...req.body, userId: user._id };
    const certification = await Certification.create(data);
    res.status(201).json(certification);
  } catch (err) {
    next(err);
  }
};

export const getCertificationByUsername = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) throw new APIError("User not found", 404);

    const certification = await Certification.findOne({ userId: user._id });
    if (!certification) throw new APIError("Certification not found", 404);

    res.status(200).json(certification);
  } catch (err) {
    next(err);
  }
};

export const updateCertificationByUsername = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) throw new APIError("User not found", 404);

    if (!req.user || user._id !== req.currentUser?.id)
      throw new APIError("Forbidden", 403);

    const updated = await Certification.findOneAndUpdate(
      { userId: user._id },
      req.body,
      { new: true }
    );

    if (!updated)
      throw new APIError("Update failed, certification not found", 404);

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

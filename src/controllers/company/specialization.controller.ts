import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../../models/User";
import APIError from "../../utils/APIError";
import Specialization from "../../models/profile/Specialization";

export const createSpecialization = async (
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

    const existing = await Specialization.findOne({ userId: user._id });
    if (existing) throw new APIError("Specialization already exists", 400);

    const data = { ...req.body, userId: user._id };
    const specialization = await Specialization.create(data);
    res.status(201).json(specialization);
  } catch (err) {
    next(err);
  }
};

export const getSpecializationByUsername = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) throw new APIError("User not found", 404);

    const specialization = await Specialization.findOne({ userId: user._id });
    if (!specialization) throw new APIError("Specialization not found", 404);

    res.status(200).json(specialization);
  } catch (err) {
    next(err);
  }
};

export const updateSpecializationByUsername = async (
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

    const updated = await Specialization.findOneAndUpdate(
      { userId: user._id },
      req.body,
      { new: true }
    );

    if (!updated)
      throw new APIError("Update failed, specialization not found", 404);

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

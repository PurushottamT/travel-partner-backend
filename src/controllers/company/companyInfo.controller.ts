import CompanyInfo from "../../models/profile/CompanyInfo.model";
import User, { IUser } from "../../models/User";
import { Request, Response } from "express";
import APIError from "../../utils/APIError";

export const createCompanyInfo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username } = req.params;
  const user = (await User.findOne({ username })) as IUser;
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  if (!req.user || user._id !== req.currentUser?.id)
    throw new APIError("Forbidden", 403);

  const data = { ...req.body, userId: user._id };
  const existing = await CompanyInfo.findOne({ userId: user._id });
  if (existing)
    throw new APIError("Company Info already exists for this user", 400);

  const info = await CompanyInfo.create(data);
  res.status(201).json(info);
};

export const getCompanyInfoByUsername = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username } = req.params;
  const user = (await User.findOne({ username })) as IUser;
  if (!user) throw new APIError("User not found", 404);

  const info = await CompanyInfo.findOne({ userId: user._id });
  if (!info) throw new APIError("Company Info not found", 404);

  res.json(info);
};

export const updateCompanyInfoByUsername = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username } = req.params;
  const user = (await User.findOne({ username })) as IUser;
  if (!user) throw new APIError("User not found", 404);

  if (user._id !== req.currentUser?.id) throw new APIError("Forbidden", 403);

  const updated = await CompanyInfo.findOneAndUpdate(
    { userId: user._id },
    req.body,
    { new: true }
  );
  res.json(updated);
};

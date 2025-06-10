import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../../models/User";
import APIError from "../../utils/APIError";
import BankDetail from "../../models/profile/BankDetail";

export const createBankDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username } = req.params;
    const user = (await User.findOne({ username })) as IUser;
    if (!user) throw new APIError("User not found", 404);

    if (!req.user || user._id !== req.currentUser?.id)
      throw new APIError("Forbidden", 403);

    const existing = await BankDetail.findOne({ userId: user._id });
    if (existing) throw new APIError("Bank detail already exists", 400);

    const data = { ...req.body, userId: user._id };
    const bankDetail = await BankDetail.create(data);
    res.status(201).json(bankDetail);
  } catch (err) {
    next(err);
  }
};

export const getBankDetailByUsername = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) throw new APIError("User not found", 404);

    const bankDetail = await BankDetail.findOne({ userId: user._id });
    if (!bankDetail) throw new APIError("Bank detail not found", 404);

    res.status(200).json(bankDetail);
  } catch (err) {
    next(err);
  }
};

export const updateBankDetailByUsername = async (
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

    const updated = await BankDetail.findOneAndUpdate(
      { userId: user._id },
      req.body,
      { new: true }
    );

    if (!updated)
      throw new APIError("Update failed, bank detail not found", 404);

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

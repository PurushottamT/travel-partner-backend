import jwt from "jsonwebtoken";
import { IUser } from "../models/User";

const accessSecret = process.env.ACCESS_TOKEN_SECRET!;
const refreshSecret = process.env.REFRESH_TOKEN_SECRET!;

export const generateAccessToken = (user: IUser) => {
  return jwt.sign({ id: user._id, role: user.role }, accessSecret, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (user: IUser) => {
  return jwt.sign({ id: user._id, role: user.role }, refreshSecret, {
    expiresIn: "7d",
  });
};

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, accessSecret);

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, refreshSecret);

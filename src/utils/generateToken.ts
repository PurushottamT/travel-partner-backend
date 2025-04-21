import jwt from "jsonwebtoken";
import { UserPayload } from "../types/UserPayload";

export const generateToken = (
  user: UserPayload
): { accessToken: string; refreshToken: string } => {
  const accessToken = jwt.sign(user, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ id: user._id }, process.env.JWTSECRET!, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

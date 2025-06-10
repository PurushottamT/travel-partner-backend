import mongoose, { Document } from "mongoose";

export type Role =
  | "super-admin"
  | "travel-agent"
  | "vehicle-agent"
  | "guide"
  | "user";

export interface IUser extends Document {
  username: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  password: string;
  role: Role;
  refreshToken?: string;
  status: boolean;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["super-admin", "travel-agent", "vehicle-agent", "guide", "user"],
      default: "user",
    },
    refreshToken: { type: String },
    status: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);

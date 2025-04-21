import mongoose, { Document, Schema } from "mongoose";

export enum UserRole {
  Super_ADMIN = "super_admin",
  TRAVEL_AGENT = "travel_agent",
  VEHICLE_AGENT = "vehicle_agent",
  GUIDE = "guide",
  USER = "user",
}

//User Interface
export interface IUser extends Document {
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: UserRole;
  profileImage?: string;
  status: "active" | "inactive";
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    profileImage: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UserSchema.index({ username: 1, email: 1, phoneNumber: 1 }, { unique: true });

const User = mongoose.model<IUser>("User", UserSchema);

export default User;

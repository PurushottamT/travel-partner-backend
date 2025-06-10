import mongoose, { Schema, Document } from "mongoose";

export interface ISpecialization extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  description: string;
  destinations: string[];
  serviceTypes: string[];
  languagesSupported: string[];
  specialties: string[];
}

const SpecializationSchema = new Schema<ISpecialization>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: String,
  description: String,
  destinations: [String],
  serviceTypes: [String],
  languagesSupported: [String],
  specialties: [String],
});

export default mongoose.model<ISpecialization>(
  "Specialization",
  SpecializationSchema
);

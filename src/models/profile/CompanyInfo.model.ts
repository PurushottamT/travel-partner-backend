import mongoose, { Schema, Document } from "mongoose";

export interface ICompanyInfo extends Document {
  userId: mongoose.Types.ObjectId;
  companyName: string;
  registrationNumber: string;
  registrationDate: Date;
  location: string;
  address: string;
  contactPerson: string;
  phone: string;
  fax: string;
  website: string;
  description: string;
  servicesOffered: string[];
  rating: number;
  reviewCount: number;
  businessHours: string;
  paymentMethods: string[];
}

const CompanyInfoSchema = new Schema<ICompanyInfo>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  companyName: String,
  registrationNumber: String,
  registrationDate: Date,
  location: String,
  address: String,
  contactPerson: String,
  phone: String,
  fax: String,
  website: String,
  description: String,
  servicesOffered: [String],
  rating: Number,
  reviewCount: Number,
  businessHours: String,
  paymentMethods: [String],
});

export default mongoose.model<ICompanyInfo>("CompanyInfo", CompanyInfoSchema);

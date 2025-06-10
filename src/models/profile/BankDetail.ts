import mongoose, { Schema, Document } from "mongoose";

export interface IBankDetail extends Document {
  userId: mongoose.Types.ObjectId;
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  branchName: string;
  swiftCode: string;
  currency: string;
  paymentTerms: string;
}

const BankDetailSchema = new Schema<IBankDetail>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  accountHolderName: String,
  accountNumber: String,
  bankName: String,
  branchName: String,
  swiftCode: String,
  currency: String,
  paymentTerms: String,
});

export default mongoose.model<IBankDetail>("BankDetail", BankDetailSchema);

import mongoose, { Schema, Document } from "mongoose";

export interface ICertification extends Document {
  userId: mongoose.Types.ObjectId;
  certificateType: string;
  issuingAuthority: string;
  issueDate: Date;
  documentId: string;
  status: string;
}

const CertificationSchema = new Schema<ICertification>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  certificateType: String,
  issuingAuthority: String,
  issueDate: Date,
  documentId: String,
  status: String,
});

export default mongoose.model<ICertification>(
  "Certification",
  CertificationSchema
);

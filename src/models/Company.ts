import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  email: string;
  password: string;
  industry: string;
  logo?: string;
  description?: string;
  website?: string;
  location?: string;
  plan: 'free' | 'pro' | 'enterprise';
  resetToken?: string;
  resetTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    industry: { type: String, required: true },
    logo: { type: String },
    description: { type: String },
    website: { type: String },
    location: { type: String },
    plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },
  { timestamps: true }
);

const Company: Model<ICompany> = mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema);
export default Company;

import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  industry: string;
  size: string;
  website?: string;
  logo?: string;
  description?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  contactInfo?: {
    email?: string;
    phone?: string;
  };
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    trim: true,
  },
  size: {
    type: String,
    trim: true,
  },
  website: {
    type: String,
    trim: true,
  },
  logo: {
    type: String,
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    zipCode: { type: String, trim: true },
  },
  contactInfo: {
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
  },
  socialLinks: {
    linkedin: { type: String, trim: true },
    twitter: { type: String, trim: true },
    github: { type: String, trim: true },
  },
}, {
  timestamps: true,
});

// Indexes
CompanySchema.index({ userId: 1, name: 1 });
CompanySchema.index({ userId: 1, industry: 1 });

export const Company = mongoose.model<ICompany>('Company', CompanySchema);
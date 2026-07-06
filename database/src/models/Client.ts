import mongoose, { Schema, Document } from 'mongoose';

export interface IClient extends Document {
  userId: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  status: 'active' | 'inactive' | 'archived';
  source: 'manual' | 'import' | 'api';
  tags: mongoose.Types.ObjectId[];
  notes?: string;
  totalProjects: number;
  totalRevenue: number;
  lastContactDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema<IClient>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  company: {
    type: String,
    trim: true,
  },
  website: {
    type: String,
    trim: true,
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    zipCode: { type: String, trim: true },
  },
  socialLinks: {
    linkedin: { type: String, trim: true },
    twitter: { type: String, trim: true },
    github: { type: String, trim: true },
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
    default: 'active',
  },
  source: {
    type: String,
    enum: ['manual', 'import', 'api'],
    default: 'manual',
  },
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'Tag',
  }],
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters'],
  },
  totalProjects: {
    type: Number,
    default: 0,
  },
  totalRevenue: {
    type: Number,
    default: 0,
  },
  lastContactDate: { type: Date },
}, {
  timestamps: true,
});

// Indexes
ClientSchema.index({ userId: 1, createdAt: -1 });
ClientSchema.index({ userId: 1, email: 1 });
ClientSchema.index({ userId: 1, status: 1 });
ClientSchema.index({ userId: 1, company: 1 });

export const Client = mongoose.model<IClient>('Client', ClientSchema);
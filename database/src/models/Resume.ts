import mongoose, { Schema, Document } from 'mongoose';

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  template: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    github?: string;
    summary?: string;
  };
  experience: {
    company: string;
    position: string;
    location?: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    description: string;
    achievements: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    field: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    gpa?: string;
    achievements?: string[];
  }[];
  skills: {
    category: string;
    items: string[];
  }[];
  projects: {
    name: string;
    description: string;
    technologies: string[];
    url?: string;
  }[];
  certifications: {
    name: string;
    issuer: string;
    date: Date;
    expiryDate?: Date;
    credentialId?: string;
    url?: string;
  }[];
  languages: {
    language: string;
    proficiency: string;
  }[];
  customSections?: {
    title: string;
    content: string;
  }[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema<IResume>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
  title: {
    type: String,
    required: [true, 'Resume title is required'],
    trim: true,
  },
  template: {
    type: String,
    required: [true, 'Template is required'],
    default: 'modern',
  },
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    website: { type: String },
    linkedin: { type: String },
    github: { type: String },
    summary: { type: String },
  },
  experience: [{
    company: { type: String, required: true },
    position: { type: String, required: true },
    location: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    current: { type: Boolean, default: false },
    description: { type: String, required: true },
    achievements: [{ type: String }],
  }],
  education: [{
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    field: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    current: { type: Boolean, default: false },
    gpa: { type: String },
    achievements: [{ type: String }],
  }],
  skills: [{
    category: { type: String, required: true },
    items: [{ type: String, required: true }],
  }],
  projects: [{
    name: { type: String, required: true },
    description: { type: String, required: true },
    technologies: [{ type: String }],
    url: { type: String },
  }],
  certifications: [{
    name: { type: String, required: true },
    issuer: { type: String, required: true },
    date: { type: Date, required: true },
    expiryDate: { type: Date },
    credentialId: { type: String },
    url: { type: String },
  }],
  languages: [{
    language: { type: String, required: true },
    proficiency: { type: String, required: true },
  }],
  customSections: [{
    title: { type: String, required: true },
    content: { type: String, required: true },
  }],
  isDefault: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Indexes
ResumeSchema.index({ userId: 1, isDefault: -1 });
ResumeSchema.index({ userId: 1, createdAt: -1 });

export const Resume = mongoose.model<IResume>('Resume', ResumeSchema);
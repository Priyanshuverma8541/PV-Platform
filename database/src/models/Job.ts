import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  company: string;
  companyId?: mongoose.Types.ObjectId;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';
  remote: boolean;
  salary?: {
    min: number;
    max: number;
    currency: string;
    period: string;
  };
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits?: string[];
  applicationUrl?: string;
  source: 'manual' | 'linkedin' | 'indeed' | 'glassdoor' | 'other';
  status: 'saved' | 'applied' | 'interviewing' | 'offered' | 'rejected' | 'accepted';
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  appliedDate?: Date;
  interviewDates?: Date[];
  tags: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'freelance', 'internship'],
    required: [true, 'Job type is required'],
  },
  remote: {
    type: Boolean,
    default: false,
  },
  salary: {
    min: { type: Number, min: 0 },
    max: { type: Number, min: 0 },
    currency: { type: String, default: 'USD' },
    period: { type: String, default: 'year' },
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
  },
  requirements: [{
    type: String,
    trim: true,
  }],
  responsibilities: [{
    type: String,
    trim: true,
  }],
  benefits: [{
    type: String,
    trim: true,
  }],
  applicationUrl: {
    type: String,
    trim: true,
  },
  source: {
    type: String,
    enum: ['manual', 'linkedin', 'indeed', 'glassdoor', 'other'],
    default: 'manual',
  },
  status: {
    type: String,
    enum: ['saved', 'applied', 'interviewing', 'offered', 'rejected', 'accepted'],
    default: 'saved',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters'],
  },
  appliedDate: { type: Date },
  interviewDates: [{ type: Date }],
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'Tag',
  }],
}, {
  timestamps: true,
});

// Indexes
JobSchema.index({ userId: 1, status: 1 });
JobSchema.index({ userId: 1, priority: -1 });
JobSchema.index({ userId: 1, createdAt: -1 });
JobSchema.index({ userId: 1, company: 1 });

export const Job = mongoose.model<IJob>('Job', JobSchema);
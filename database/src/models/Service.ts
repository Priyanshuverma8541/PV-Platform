import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  category: string;
  price?: {
    min: number;
    max: number;
    currency: string;
    unit: string;
  };
  features: string[];
  technologies: string[];
  duration?: string;
  isActive: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    maxlength: [100, 'Service name cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  price: {
    min: { type: Number, min: 0 },
    max: { type: Number, min: 0 },
    currency: { type: String, default: 'USD' },
    unit: { type: String, default: 'project' },
  },
  features: [{
    type: String,
    trim: true,
  }],
  technologies: [{
    type: String,
    trim: true,
  }],
  duration: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Indexes
ServiceSchema.index({ userId: 1, isActive: 1 });
ServiceSchema.index({ userId: 1, featured: -1 });
ServiceSchema.index({ userId: 1, category: 1 });

export const Service = mongoose.model<IService>('Service', ServiceSchema);
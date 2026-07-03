import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  techStack: string[];
  urls: {
    github?: string;
    live?: string;
    vercel?: string;
  };
  status: 'active' | 'archived' | 'deployed';
  settings: {
    public: boolean;
    featured: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  techStack: [{
    type: String,
    trim: true,
  }],
  urls: {
    github: { type: String },
    live: { type: String },
    vercel: { type: String },
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'deployed'],
    default: 'active',
  },
  settings: {
    public: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
}, {
  timestamps: true,
});

// Index for faster queries
ProjectSchema.index({ userId: 1, createdAt: -1 });
ProjectSchema.index({ userId: 1, status: 1 });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
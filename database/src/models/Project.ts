import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  shortDescription?: string;
  category: mongoose.Types.ObjectId;
  tags: mongoose.Types.ObjectId[];
  techStack: string[];
  urls: {
    github?: string;
    live?: string;
    vercel?: string;
    netlify?: string;
    demo?: string;
  };
  media: {
    coverImage?: string;
    screenshots?: string[];
    video?: string;
  };
  status: 'active' | 'archived' | 'deployed' | 'draft';
  visibility: 'public' | 'private' | 'unlisted';
  featured: boolean;
  priority: number;
  startDate?: Date;
  endDate?: Date;
  metrics: {
    views: number;
    likes: number;
    stars: number;
    forks: number;
  };
  seo: {
    slug: string;
    metaTitle?: string;
    metaDescription?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [100, 'Project name cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot exceed 200 characters'],
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
  },
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'Tag',
  }],
  techStack: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  urls: {
    github: { type: String, trim: true },
    live: { type: String, trim: true },
    vercel: { type: String, trim: true },
    netlify: { type: String, trim: true },
    demo: { type: String, trim: true },
  },
  media: {
    coverImage: { type: String },
    screenshots: [{ type: String }],
    video: { type: String },
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'deployed', 'draft'],
    default: 'active',
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'unlisted'],
    default: 'public',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: Number,
    default: 0,
    min: 0,
  },
  startDate: { type: Date },
  endDate: { type: Date },
  metrics: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    stars: { type: Number, default: 0 },
    forks: { type: Number, default: 0 },
  },
  seo: {
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    metaTitle: { type: String, maxlength: [60, 'Meta title cannot exceed 60 characters'] },
    metaDescription: { type: String, maxlength: [160, 'Meta description cannot exceed 160 characters'] },
  },
}, {
  timestamps: true,
});

// Compound indexes for common queries
ProjectSchema.index({ userId: 1, createdAt: -1 });
ProjectSchema.index({ userId: 1, status: 1 });
ProjectSchema.index({ userId: 1, featured: -1 });
ProjectSchema.index({ userId: 1, priority: -1 });
ProjectSchema.index({ 'seo.slug': 1 }, { unique: true });
ProjectSchema.index({ category: 1 });
ProjectSchema.index({ tags: 1 });
ProjectSchema.index({ 'metrics.views': -1 });
ProjectSchema.index({ 'metrics.likes': -1 });

// Generate slug before saving
ProjectSchema.pre('save', async function(next) {
  if (!this.seo.slug || this.isModified('name')) {
    const slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    this.seo.slug = `${slug}-${Date.now()}`;
  }
  next();
});

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
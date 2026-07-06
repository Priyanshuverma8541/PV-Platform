import mongoose, { Schema, Document } from 'mongoose';

export interface ITag extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  color?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TagSchema = new Schema<ITag>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Tag name is required'],
    trim: true,
    maxlength: [50, 'Tag name cannot exceed 50 characters'],
  },
  slug: {
    type: String,
    required: [true, 'Tag slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  color: {
    type: String,
    trim: true,
    default: '#3B82F6',
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot exceed 200 characters'],
  },
}, {
  timestamps: true,
});

// Indexes
TagSchema.index({ userId: 1, name: 1 });
TagSchema.index({ slug: 1 });

export const Tag = mongoose.model<ITag>('Tag', TagSchema);
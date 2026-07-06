import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  parentId?: mongoose.Types.ObjectId;
  icon?: string;
  color?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [50, 'Category name cannot exceed 50 characters'],
  },
  slug: {
    type: String,
    required: [true, 'Category slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot exceed 200 characters'],
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  icon: {
    type: String,
    trim: true,
  },
  color: {
    type: String,
    trim: true,
    default: '#3B82F6',
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes
CategorySchema.index({ userId: 1, name: 1 });
CategorySchema.index({ slug: 1 });
CategorySchema.index({ userId: 1, parentId: 1 });

export const Category = mongoose.model<ICategory>('Category', CategorySchema);
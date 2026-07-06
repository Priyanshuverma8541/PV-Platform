import mongoose, { Schema, Document } from 'mongoose';

export interface IMedia extends Document {
  userId: mongoose.Types.ObjectId;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  cloudinaryId?: string;
  folder?: string;
  tags: string[];
  alt?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
  filename: {
    type: String,
    required: [true, 'Filename is required'],
    trim: true,
  },
  originalName: {
    type: String,
    required: [true, 'Original name is required'],
    trim: true,
  },
  mimeType: {
    type: String,
    required: [true, 'MIME type is required'],
    trim: true,
  },
  size: {
    type: Number,
    required: [true, 'File size is required'],
    min: 0,
  },
  url: {
    type: String,
    required: [true, 'URL is required'],
    trim: true,
  },
  cloudinaryId: {
    type: String,
    trim: true,
  },
  folder: {
    type: String,
    trim: true,
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  alt: {
    type: String,
    maxlength: [200, 'Alt text cannot exceed 200 characters'],
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
}, {
  timestamps: true,
});

// Indexes
MediaSchema.index({ userId: 1, createdAt: -1 });
MediaSchema.index({ userId: 1, mimeType: 1 });
MediaSchema.index({ userId: 1, folder: 1 });
MediaSchema.index({ tags: 1 });

export const Media = mongoose.model<IMedia>('Media', MediaSchema);

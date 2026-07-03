import mongoose, { Schema, Document } from 'mongoose';
import { FileMetadata } from 'pv-core';

export interface MediaDocument extends Document, Omit<FileMetadata, '_id'> {
  _id: string;
}

const mediaSchema = new Schema<MediaDocument>(
  {
    userId: { type: String, required: true, index: true },
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true },
    thumbnailUrl: { type: String },
    folder: { type: String, required: true, index: true },
    tags: [{ type: String, index: true }],
    metadata: { type: Schema.Types.Mixed, default: {} }
  },
  {
    timestamps: true,
    collection: 'media_files'
  }
);

// Indexes for common queries
mediaSchema.index({ userId: 1, folder: 1 });
mediaSchema.index({ userId: 1, createdAt: -1 });
mediaSchema.index({ tags: 1 });

export const Media = mongoose.model<MediaDocument>('Media', mediaSchema);
export default Media;
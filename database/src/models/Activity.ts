import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
  userId: mongoose.Types.ObjectId;
  action: string;
  entityType: 'project' | 'client' | 'job' | 'invoice' | 'resume' | 'user' | 'other';
  entityId: mongoose.Types.ObjectId;
  description: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const ActivitySchema = new Schema<IActivity>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
  action: {
    type: String,
    required: [true, 'Action is required'],
    trim: true,
  },
  entityType: {
    type: String,
    required: [true, 'Entity type is required'],
    enum: ['project', 'client', 'job', 'invoice', 'resume', 'user', 'other'],
  },
  entityId: {
    type: Schema.Types.ObjectId,
    required: [true, 'Entity ID is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  metadata: {
    type: Map,
    of: Schema.Types.Mixed,
  },
  ipAddress: {
    type: String,
    trim: true,
  },
  userAgent: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Indexes
ActivitySchema.index({ userId: 1, createdAt: -1 });
ActivitySchema.index({ userId: 1, entityType: 1, entityId: 1 });
ActivitySchema.index({ userId: 1, action: 1 });

export const Activity = mongoose.model<IActivity>('Activity', ActivitySchema);
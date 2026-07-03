import mongoose, { Schema, Document } from 'mongoose';

export interface IDeployment extends Document {
  projectId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  environment: 'development' | 'staging' | 'production';
  status: 'pending' | 'building' | 'success' | 'failed';
  logs?: string;
  deployedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DeploymentSchema = new Schema<IDeployment>({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  environment: {
    type: String,
    enum: ['development', 'staging', 'production'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'building', 'success', 'failed'],
    default: 'pending',
  },
  logs: { type: String },
  deployedAt: { type: Date },
}, {
  timestamps: true,
});

// Index for faster queries
DeploymentSchema.index({ projectId: 1, createdAt: -1 });
DeploymentSchema.index({ userId: 1, createdAt: -1 });

export const Deployment = mongoose.model<IDeployment>('Deployment', DeploymentSchema);
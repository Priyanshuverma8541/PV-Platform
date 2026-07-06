import mongoose, { Schema, Document } from 'mongoose';

export interface ISetting extends Document {
  userId: mongoose.Types.ObjectId;
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'json' | 'array';
  category: string;
  description?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SettingSchema = new Schema<ISetting>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
  key: {
    type: String,
    required: [true, 'Setting key is required'],
    trim: true,
  },
  value: {
    type: Schema.Types.Mixed,
    required: [true, 'Setting value is required'],
  },
  type: {
    type: String,
    enum: ['string', 'number', 'boolean', 'json', 'array'],
    required: [true, 'Setting type is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    index: true,
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Compound index for unique user settings
SettingSchema.index({ userId: 1, key: 1 }, { unique: true });
SettingSchema.index({ userId: 1, category: 1 });

export const Setting = mongoose.model<ISetting>('Setting', SettingSchema);
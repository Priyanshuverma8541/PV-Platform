import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  profile: {
    firstName: string;
    lastName: string;
    avatar: string;
    bio: string;
  };
  oauth?: {
    google?: { id: string; email: string };
    github?: { id: string; username: string };
  };
  settings: {
    twoFactorEnabled: boolean;
    emailNotifications: boolean;
    theme: 'light' | 'dark';
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  profile: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' }
  },
  oauth: {
    google: {
      id: String,
      email: String
    },
    github: {
      id: String,
      username: String
    }
  },
  settings: {
    twoFactorEnabled: { type: Boolean, default: false },
    emailNotifications: { type: Boolean, default: true },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' }
  }
}, {
  timestamps: true
});

export const User = mongoose.model<IUser>('User', UserSchema);
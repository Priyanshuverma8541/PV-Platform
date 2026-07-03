import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password?: string;
  profile: {
    firstName: string;
    lastName: string;
    avatar?: string;
    bio?: string;
  };
  oauth?: {
    google?: {
      id: string;
      email: string;
    };
    github?: {
      id: string;
      username: string;
    };
  };
  settings: {
    twoFactorEnabled: boolean;
    emailNotifications: boolean;
    theme: 'light' | 'dark';
  };
  emailVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: function() { return !this.oauth; },
    select: false,
  },
  profile: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    avatar: { type: String },
    bio: { type: String },
  },
  oauth: {
    google: {
      id: { type: String },
      email: { type: String },
    },
    github: {
      id: { type: String },
      username: { type: String },
    },
  },
  settings: {
    twoFactorEnabled: { type: Boolean, default: false },
    emailNotifications: { type: Boolean, default: true },
    theme: { type: String, enum: ['light', 'dark'], default: 'dark' },
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
}, {
  timestamps: true,
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Index for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ createdAt: -1 });

export const User = mongoose.model<IUser>('User', UserSchema);
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
    phone?: string;
    dateOfBirth?: Date;
    location?: string;
    website?: string;
    socialLinks?: {
      linkedin?: string;
      github?: string;
      twitter?: string;
      portfolio?: string;
    };
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
  role: 'user' | 'admin' | 'superadmin';
  settings: {
    twoFactorEnabled: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
  };
  emailVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: function() { return !this.oauth; },
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  profile: {
    firstName: { 
      type: String, 
      required: [true, 'First name is required'],
      trim: true 
    },
    lastName: { 
      type: String, 
      required: [true, 'Last name is required'],
      trim: true 
    },
    avatar: { type: String },
    bio: { type: String, maxlength: [500, 'Bio cannot exceed 500 characters'] },
    phone: { type: String, trim: true },
    dateOfBirth: { type: Date },
    location: { type: String, trim: true },
    website: { type: String, trim: true },
    socialLinks: {
      linkedin: { type: String, trim: true },
      github: { type: String, trim: true },
      twitter: { type: String, trim: true },
      portfolio: { type: String, trim: true },
    },
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
  role: {
    type: String,
    enum: ['user', 'admin', 'superadmin'],
    default: 'user',
  },
  settings: {
    twoFactorEnabled: { type: Boolean, default: false },
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    theme: { 
      type: String, 
      enum: ['light', 'dark', 'system'], 
      default: 'dark' 
    },
    language: { type: String, default: 'en' },
    timezone: { type: String, default: 'UTC' },
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  lastLogin: { type: Date },
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

// Indexes for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ 'profile.firstName': 1, 'profile.lastName': 1 });

export const User = mongoose.model<IUser>('User', UserSchema);
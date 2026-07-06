import mongoose, { Schema, Document } from 'mongoose';

export interface ISkill extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  category: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
  description?: string;
  projects: mongoose.Types.ObjectId[];
  certifications?: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  proficiency: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    required: [true, 'Proficiency level is required'],
  },
  yearsOfExperience: {
    type: Number,
    min: 0,
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  projects: [{
    type: Schema.Types.ObjectId,
    ref: 'Project',
  }],
  certifications: [{
    type: String,
    trim: true,
  }],
  featured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Indexes
SkillSchema.index({ userId: 1, category: 1 });
SkillSchema.index({ userId: 1, featured: -1 });
SkillSchema.index({ userId: 1, proficiency: 1 });
SkillSchema.index({ name: 1 });

export const Skill = mongoose.model<ISkill>('Skill', SkillSchema);
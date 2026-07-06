import { z } from 'zod';

export const UserValidation = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
});

export const RegisterValidation = UserValidation.extend({
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const LoginValidation = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const UpdateProfileValidation = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  phone: z.string().optional(),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
  location: z.string().optional(),
  website: z.string().url('Invalid website URL').optional(),
  socialLinks: z.object({
    linkedin: z.string().url().optional(),
    github: z.string().url().optional(),
    twitter: z.string().url().optional(),
    portfolio: z.string().url().optional(),
  }).optional(),
});
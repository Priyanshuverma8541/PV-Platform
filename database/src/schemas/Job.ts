import { z } from 'zod';

export const JobValidation = z.object({
  title: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company name is required'),
  location: z.string().min(1, 'Location is required'),
  type: z.enum(['full-time', 'part-time', 'contract', 'freelance', 'internship']),
  remote: z.boolean().optional(),
  salary: z.object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional(),
    currency: z.string().default('USD'),
    period: z.string().default('year'),
  }).optional(),
  description: z.string().min(1, 'Job description is required'),
  requirements: z.array(z.string()).optional(),
  responsibilities: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  applicationUrl: z.string().url().optional(),
  status: z.enum(['saved', 'applied', 'interviewing', 'offered', 'rejected', 'accepted']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
});

export const CreateJobValidation = JobValidation;

export const UpdateJobValidation = JobValidation.partial();
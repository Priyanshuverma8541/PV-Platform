import { z } from 'zod';

export const ProjectValidation = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Project name cannot exceed 100 characters'),
  description: z.string().min(1, 'Project description is required').max(2000, 'Description cannot exceed 2000 characters'),
  shortDescription: z.string().max(200, 'Short description cannot exceed 200 characters').optional(),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).optional(),
  techStack: z.array(z.string()).optional(),
  urls: z.object({
    github: z.string().url().optional(),
    live: z.string().url().optional(),
    vercel: z.string().url().optional(),
    netlify: z.string().url().optional(),
    demo: z.string().url().optional(),
  }).optional(),
  status: z.enum(['active', 'archived', 'deployed', 'draft']).optional(),
  visibility: z.enum(['public', 'private', 'unlisted']).optional(),
  featured: z.boolean().optional(),
  priority: z.number().min(0).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const CreateProjectValidation = ProjectValidation;

export const UpdateProjectValidation = ProjectValidation.partial();
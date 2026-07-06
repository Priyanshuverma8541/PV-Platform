import { z } from 'zod';

export const ClientValidation = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  website: z.string().url().optional(),
  status: z.enum(['active', 'inactive', 'archived']).optional(),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
});

export const CreateClientValidation = ClientValidation;

export const UpdateClientValidation = ClientValidation.partial();
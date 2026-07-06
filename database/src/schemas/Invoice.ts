import { z } from 'zod';

export const InvoiceValidation = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']).optional(),
  dueDate: z.string().datetime(),
  items: z.array(z.object({
    description: z.string().min(1, 'Item description is required'),
    quantity: z.number().min(0, 'Quantity must be positive'),
    rate: z.number().min(0, 'Rate must be positive'),
    amount: z.number().min(0, 'Amount must be positive'),
  })),
  subtotal: z.number().min(0, 'Subtotal must be positive'),
  tax: z.object({
    rate: z.number().min(0).max(100).optional(),
    amount: z.number().min(0).optional(),
  }).optional(),
  discount: z.object({
    type: z.enum(['percentage', 'fixed']),
    value: z.number().min(0),
    amount: z.number().min(0),
  }).optional(),
  total: z.number().min(0, 'Total must be positive'),
  currency: z.string().default('USD'),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
  terms: z.string().max(2000, 'Terms cannot exceed 2000 characters').optional(),
});

export const CreateInvoiceValidation = InvoiceValidation;

export const UpdateInvoiceValidation = InvoiceValidation.partial();
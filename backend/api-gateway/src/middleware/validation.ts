import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from 'pv-core';
import { z } from 'zod';

const validationSchemas: Record<string, z.ZodSchema> = {
  auth: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(2)
  }),
  
  ai: z.object({
    prompt: z.string().min(1).max(10000),
    feature: z.string(),
    systemPrompt: z.string().optional()
  }),
  
  media: z.object({
    file: z.any(),
    folder: z.string().optional()
  }),
  
  notifications: z.object({
    userId: z.string(),
    channel: z.enum(['email', 'sms', 'push', 'slack', 'discord', 'whatsapp']),
    subject: z.string().optional(),
    body: z.string()
  }),
  
  search: z.object({
    query: z.string().min(1).max(500),
    filters: z.object({
      types: z.array(z.string()).optional(),
      userId: z.string().optional(),
      tags: z.array(z.string()).optional()
    }).optional()
  }),
  
  analytics: z.object({
    event: z.string(),
    metadata: z.record(z.any()).optional()
  })
};

export function validateRequest(service: string) {
  return (req: Request, res: Response<ApiResponse<any>>, next: NextFunction): void => {
    try {
      const schema = validationSchemas[service];
      
      if (!schema) {
        next();
        return;
      }

      const validated = schema.parse(req.body);
      req.body = validated;
      
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`),
          timestamp: new Date(),
          requestId: (req as any).requestId
        } as ApiResponse<any>);
        return;
      }
      
      next(error);
    }
  };
}
import type { Request } from 'express';

/** Every authenticated request carries this after requireAuth middleware */
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

/** The shape every AI response returns from the service layer */
export interface AIResponse {
  content: string;
  provider: string;
  model: string;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
  };
}

/** What callers send to the AI router */
export interface AIRequest {
  prompt: string;
  systemPrompt?: string;
  userId?: string;
  feature: AIFeature;
  metadata?: Record<string, unknown>;
}

/** All features that can be requested — drives usage tracking and rate limiting */
export type AIFeature =
  | 'chat'
  | 'resume'
  | 'cover_letter'
  | 'proposal'
  | 'email'
  | 'portfolio_review'
  | 'code_review'
  | 'research'
  | 'career_coach'
  | 'buildhub'
  | 'crm_assistant'
  | 'business_consultant';

/** Stored in MongoDB for analytics / Mission Control */
export interface AIUsageRecord {
  userId: string;
  feature: AIFeature;
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  durationMs: number;
  success: boolean;
  createdAt: Date;
}

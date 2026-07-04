/**
 * Prompt service — the single place where prompt templates are
 * assembled.  Controllers pass structured data; this converts it
 * to a final prompt string sent to the AI Router.
 *
 * Why: if you ever need to A/B test prompts, version them, or store
 * them in a DB, you change this file — nowhere else.
 */

import { resumePrompt } from '../prompts/resume/resume.prompt';
import { proposalPrompt } from '../prompts/proposal/proposal.prompt';
import { emailPrompt } from '../prompts/email/email.prompt';
import { portfolioReviewPrompt } from '../prompts/portfolio/portfolio.prompt';
import { buildhubPrompt } from '../prompts/buildhub/buildhub.prompt';
import { crmPrompt } from '../prompts/crm/crm.prompt';
import { careerCoachPrompt } from '../prompts/career/career.prompt';
import { chatPrompt } from '../prompts/chat/chat.prompt';
import type { AIFeature } from '../types/index';

export interface PromptInput {
  feature: AIFeature;
  data: Record<string, unknown>;
}

export interface BuiltPrompt {
  userPrompt: string;
  systemPrompt: string;
}

export function buildPrompt(input: PromptInput): BuiltPrompt {
  switch (input.feature) {
    case 'resume':
      return resumePrompt(input.data);
    case 'proposal':
      return proposalPrompt(input.data);
    case 'email':
      return emailPrompt(input.data);
    case 'portfolio_review':
      return portfolioReviewPrompt(input.data);
    case 'buildhub':
      return buildhubPrompt(input.data);
    case 'crm_assistant':
      return crmPrompt(input.data);
    case 'career_coach':
      return careerCoachPrompt(input.data);
    case 'chat':
    default:
      return chatPrompt(input.data);
  }
}

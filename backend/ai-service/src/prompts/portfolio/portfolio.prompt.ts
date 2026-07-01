import type { BuiltPrompt } from '../../services/prompt.service.js';

export function portfolioReviewPrompt(data: Record<string, unknown>): BuiltPrompt {
  const { currentContent, targetAudience, goals } = data;

  return {
    systemPrompt: `You are a senior developer relations expert and career coach who 
specializes in helping software engineers build standout online portfolios. 
You understand what hiring managers, startup founders, and freelance clients 
look for. Give specific, actionable feedback — not generic advice.`,

    userPrompt: `Review and improve my portfolio content:

Current Content:
${currentContent ?? 'Not provided'}

Target Audience: ${targetAudience ?? 'Recruiters, startup founders, and freelance clients'}
Goals: ${goals ?? 'Get jobs and freelance clients'}

Provide:
1. Overall impression (1-2 sentences)
2. Top 3 strengths
3. Top 3 areas to improve (with specific suggestions)
4. Recommended headline/tagline
5. Improved bio (rewrite in compelling style)
6. SEO keywords to include
7. Missing sections I should add`,
  };
}

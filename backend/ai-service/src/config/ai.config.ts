import env from './env.js';

/**
 * Central AI provider configuration.
 * Every part of the service reads from here — no provider strings are
 * hardcoded elsewhere.  Switching providers = changing one env var.
 */
export const AI_CONFIG = {
  provider: env.AI_PROVIDER,

  gemini: {
    apiKey: env.GEMINI_API_KEY,
    model: 'gemini-1.5-flash',          // fast, generous free tier
    maxOutputTokens: 8192,
    temperature: 0.7,
  },

  openai: {
    apiKey: env.OPENAI_API_KEY,
    model: 'gpt-4o-mini',
    maxTokens: 4096,
    temperature: 0.7,
  },

  claude: {
    apiKey: env.ANTHROPIC_API_KEY,
    model: 'claude-3-haiku-20240307',
    maxTokens: 4096,
    temperature: 0.7,
  },
} as const;

export type AIProvider = typeof AI_CONFIG.provider;

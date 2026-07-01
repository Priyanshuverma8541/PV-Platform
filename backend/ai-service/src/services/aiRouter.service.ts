import { AI_CONFIG } from '../config/ai.config.js';
import { callGemini } from './gemini.service.js';
import { callOpenAI } from './openai.service.js';
import { callClaude } from './claude.service.js';
import { AIUsage } from '../utils/models.js';
import logger from '../utils/logger.js';
import type { AIRequest, AIResponse } from '../types/index.js';

/**
 * THE single entry point for all AI calls on the PV Platform.
 *
 * Portfolio, CRM, Career, Resume, BuildHub — none of them call
 * Gemini/OpenAI/Claude directly. They all call this function.
 *
 * Changing the AI provider = changing AI_PROVIDER in .env
 * Everything else stays the same.
 */
export async function routeAIRequest(request: AIRequest): Promise<AIResponse> {
  const start = Date.now();
  const provider = AI_CONFIG.provider;

  logger.info(`AI Router | provider=${provider} | feature=${request.feature} | userId=${request.userId ?? 'anon'}`);

  let response: AIResponse;

  try {
    switch (provider) {
      case 'gemini':
        response = await callGemini(request);
        break;
      case 'openai':
        response = await callOpenAI(request);
        break;
      case 'claude':
        response = await callClaude(request);
        break;
      default:
        throw new Error(`Unknown AI provider: ${provider}`);
    }

    // Track usage asynchronously — don't block the response
    if (request.userId) {
      AIUsage.create({
        userId: request.userId,
        feature: request.feature,
        provider: response.provider,
        model: response.model,
        inputTokens: response.usage?.inputTokens ?? 0,
        outputTokens: response.usage?.outputTokens ?? 0,
        durationMs: Date.now() - start,
        success: true,
      }).catch((err) => logger.warn('Failed to save AI usage record', { err }));
    }

    logger.debug(`AI Router | done in ${Date.now() - start}ms`);
    return response;
  } catch (error) {
    // Track failures too
    if (request.userId) {
      AIUsage.create({
        userId: request.userId,
        feature: request.feature,
        provider,
        model: 'unknown',
        durationMs: Date.now() - start,
        success: false,
      }).catch(() => {});
    }
    throw error;
  }
}

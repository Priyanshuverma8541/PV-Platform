import { GoogleGenerativeAI } from '@google/generative-ai';
import { AI_CONFIG } from '../config/ai.config';
import type { AIRequest, AIResponse } from '../types/index';
import logger from '../utils/logger';

let client: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!client) {
    if (!AI_CONFIG.gemini.apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    client = new GoogleGenerativeAI(AI_CONFIG.gemini.apiKey);
  }
  return client;
}

export async function callGemini(request: AIRequest): Promise<AIResponse> {
  const genAI = getClient();
  const cfg = AI_CONFIG.gemini;

  const model = genAI.getGenerativeModel({
    model: cfg.model,
    generationConfig: {
      maxOutputTokens: cfg.maxOutputTokens,
      temperature: cfg.temperature,
    },
    ...(request.systemPrompt
      ? { systemInstruction: { role: 'system', parts: [{ text: request.systemPrompt }] } }
      : {}),
  });

  logger.debug(`Gemini call | feature=${request.feature}`);

  const result = await model.generateContent(request.prompt);
  const response = result.response;
  const content = response.text();

  return {
    content,
    provider: 'gemini',
    model: cfg.model,
    usage: {
      inputTokens: response.usageMetadata?.promptTokenCount,
      outputTokens: response.usageMetadata?.candidatesTokenCount,
    },
  };
}

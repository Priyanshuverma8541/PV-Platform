import type { AIRequest, AIResponse } from '../types/index.js';

/**
 * OpenAI provider — plug in when you add OPENAI_API_KEY.
 * Install: pnpm add openai --filter ai-service
 * Uncomment the implementation below.
 */
export async function callOpenAI(_request: AIRequest): Promise<AIResponse> {
  // import OpenAI from 'openai';
  // const client = new OpenAI({ apiKey: AI_CONFIG.openai.apiKey });
  // const response = await client.chat.completions.create({
  //   model: AI_CONFIG.openai.model,
  //   messages: [
  //     ...(request.systemPrompt ? [{ role: 'system', content: request.systemPrompt }] : []),
  //     { role: 'user', content: request.prompt },
  //   ],
  //   max_tokens: AI_CONFIG.openai.maxTokens,
  //   temperature: AI_CONFIG.openai.temperature,
  // });
  // return {
  //   content: response.choices[0].message.content ?? '',
  //   provider: 'openai',
  //   model: AI_CONFIG.openai.model,
  //   usage: { inputTokens: response.usage?.prompt_tokens, outputTokens: response.usage?.completion_tokens },
  // };

  throw new Error('OpenAI provider not yet configured. Set AI_PROVIDER=openai and install the openai package.');
}

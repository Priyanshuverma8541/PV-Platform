import type { AIRequest, AIResponse } from '../types/index.js';

/**
 * Anthropic Claude provider — plug in when you add ANTHROPIC_API_KEY.
 * Install: pnpm add @anthropic-ai/sdk --filter ai-service
 */
export async function callClaude(_request: AIRequest): Promise<AIResponse> {
  // import Anthropic from '@anthropic-ai/sdk';
  // const client = new Anthropic({ apiKey: AI_CONFIG.claude.apiKey });
  // const response = await client.messages.create({
  //   model: AI_CONFIG.claude.model,
  //   max_tokens: AI_CONFIG.claude.maxTokens,
  //   system: request.systemPrompt,
  //   messages: [{ role: 'user', content: request.prompt }],
  // });
  // const content = response.content[0].type === 'text' ? response.content[0].text : '';
  // return {
  //   content,
  //   provider: 'claude',
  //   model: AI_CONFIG.claude.model,
  //   usage: { inputTokens: response.usage.input_tokens, outputTokens: response.usage.output_tokens },
  // };

  throw new Error('Claude provider not yet configured. Set AI_PROVIDER=claude and install @anthropic-ai/sdk.');
}

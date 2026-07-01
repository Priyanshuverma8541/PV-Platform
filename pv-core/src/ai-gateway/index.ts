export interface AIConfig {
  provider: 'gemini' | 'openai' | 'claude';
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt?: string;
  topP?: number;
  topK?: number;
}

export interface AIProvider {
  name: string;
  complete(prompt: string, config: AIConfig): Promise<string>;
  stream(prompt: string, config: AIConfig): AsyncIterable<string>;
  getModels(): Promise<string[]>;
}

export interface AIUsage {
  userId: string;
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  timestamp: Date;
}

export interface AICache {
  prompt: string;
  provider: string;
  model: string;
  response: string;
  hash: string;
  expiresAt: Date;
  createdAt: Date;
}

export class AIGateway {
  private providers: Map<string, AIProvider> = new Map();
  private config: AIConfig | null = null;
  private cache: Map<string, AICache> = new Map();
  private usage: AIUsage[] = [];

  registerProvider(name: string, provider: AIProvider): void {
    this.providers.set(name, provider);
  }

  async getProvider(name?: string): Promise<AIProvider> {
    const providerName = name || this.config?.provider || 'gemini';
    const provider = this.providers.get(providerName);
    
    if (!provider) {
      throw new Error(`Provider not found: ${providerName}`);
    }

    return provider;
  }

  async complete(prompt: string, options?: { provider?: string; config?: Partial<AIConfig> }): Promise<string> {
    const provider = await this.getProvider(options?.provider);
    const config = { ...this.config, ...options?.config } as AIConfig;

    // Check cache
    const cacheKey = this.getCacheKey(prompt, config);
    const cached = this.cache.get(cacheKey);
    
    if (cached && new Date(cached.expiresAt) > new Date()) {
      return cached.response;
    }

    // Call provider
    const response = await provider.complete(prompt, config);

    // Cache result
    this.cache.set(cacheKey, {
      prompt,
      provider: config.provider,
      model: config.model,
      response,
      hash: cacheKey,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      createdAt: new Date()
    });

    // Track usage
    this.trackUsage(config.provider, config.model, prompt, response);

    return response;
  }

  async *stream(prompt: string, options?: { provider?: string; config?: Partial<AIConfig> }): AsyncIterable<string> {
    const provider = await this.getProvider(options?.provider);
    const config = { ...this.config, ...options?.config } as AIConfig;

    for await (const chunk of provider.stream(prompt, config)) {
      yield chunk;
    }
  }

  async getConfig(): Promise<AIConfig | null> {
    return this.config;
  }

  async updateConfig(config: Partial<AIConfig>): Promise<AIConfig> {
    this.config = { ...this.config, ...config } as AIConfig;
    return this.config;
  }

  async getProviders(): Promise<string[]> {
    return Array.from(this.providers.keys());
  }

  async getModels(providerName?: string): Promise<string[]> {
    const provider = await this.getProvider(providerName);
    return provider.getModels();
  }

  getUsage(): AIUsage[] {
    return this.usage;
  }

  clearCache(): void {
    this.cache.clear();
  }

  private getCacheKey(prompt: string, config: AIConfig): string {
    const input = JSON.stringify({ prompt, ...config });
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  private trackUsage(provider: string, model: string, prompt: string, response: string): void {
    this.usage.push({
      userId: 'system',
      provider,
      model,
      inputTokens: prompt.length,
      outputTokens: response.length,
      cost: 0,
      timestamp: new Date()
    });
  }
}

export const aiGateway = new AIGateway();
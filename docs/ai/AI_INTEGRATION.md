# AI Integration Guide

## Overview

PV Platform uses a **modular AI architecture** that supports multiple providers and can be switched without changing application code.

**Start with:** Gemini API (free tier)  
**Future:** OpenAI, Claude, or any provider

---

## AI Architecture

```
┌─────────────────────────────────────────┐
│        Application Layer                │
│   (AI Chat, Resume Generator, etc.)    │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│       AI Gateway (Router)                │
│   - Provider selection                   │
│   - Prompt templating                    │
│   - Response caching                     │
│   - Usage tracking                       │
└──────────────────┬──────────────────────┘
                   │
     ┌─────────────┼─────────────┐
     │             │             │
┌────▼─────┐ ┌────▼─────┐ ┌────▼─────┐
│  Gemini   │ │ OpenAI   │ │  Claude  │
│ Provider  │ │Provider  │ │Provider  │
└───────────┘ └──────────┘ └──────────┘
```

---

## Getting Started with Gemini API

### Step 1: Get API Key

1. Go to [Google AI Studio](https://aistudio.google.com)
2. Click "Get API Key"
3. Create a new API key
4. Copy the key

### Step 2: Set Environment Variable

```env
GEMINI_API_KEY=your_api_key_here
```

### Step 3: Test Connection

```typescript
// services/ai/providers/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testConnection() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Hello!");
    console.log("✅ Gemini API connected");
  } catch (error) {
    console.error("❌ Failed to connect to Gemini API", error);
  }
}
```

---

## AI Provider Interface

All providers implement this interface:

```typescript
// types/ai.ts
export interface AIProvider {
  name: 'gemini' | 'openai' | 'claude';
  
  // Single message completion
  complete(prompt: string, config: AIConfig): Promise<string>;
  
  // Streaming completion
  stream(prompt: string, config: AIConfig): AsyncIterable<string>;
  
  // Function calling
  callFunction(
    prompt: string,
    functions: FunctionDefinition[],
    config: AIConfig
  ): Promise<FunctionCall>;
  
  // Get available models
  getModels(): Promise<string[]>;
  
  // Get usage info
  getUsage(): Promise<{ totalTokens: number; totalCost: number }>;
}

export interface AIConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt?: string;
  topP?: number;
  topK?: number;
}

export interface FunctionDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required: string[];
  };
}

export interface FunctionCall {
  name: string;
  arguments: Record<string, any>;
}
```

---

## AI Gateway Service

```typescript
// services/ai/gateway.ts
export class AIGateway {
  private providers: Map<string, AIProvider>;
  private config: AIConfig;

  constructor() {
    this.providers = new Map();
    this.registerProviders();
  }

  private registerProviders() {
    this.providers.set('gemini', new GeminiProvider());
    this.providers.set('openai', new OpenAIProvider());
    this.providers.set('claude', new ClaudeProvider());
  }

  async getProvider(name?: string): Promise<AIProvider> {
    // Get configured provider or use specified one
    const providerName = name || (await this.getConfiguredProvider());
    
    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(`Provider not found: ${providerName}`);
    }

    return provider;
  }

  async complete(prompt: string, options?: { provider?: string; config?: Partial<AIConfig> }) {
    const provider = await this.getProvider(options?.provider);
    const config = { ...this.config, ...options?.config };

    // Check cache
    const cached = await this.getFromCache(prompt, config);
    if (cached) {
      return cached;
    }

    // Call provider
    const result = await provider.complete(prompt, config);

    // Cache result
    await this.cacheResult(prompt, config, result);

    // Track usage
    await this.trackUsage(provider.name, config);

    return result;
  }

  async stream(prompt: string, onChunk: (chunk: string) => void) {
    const provider = await this.getProvider();
    const config = this.config;

    for await (const chunk of provider.stream(prompt, config)) {
      onChunk(chunk);
    }
  }

  async callFunction(
    prompt: string,
    functions: FunctionDefinition[],
    options?: { provider?: string }
  ) {
    const provider = await this.getProvider(options?.provider);
    return provider.callFunction(prompt, functions, this.config);
  }

  private async getFromCache(prompt: string, config: AIConfig) {
    const hash = await this.hashPrompt(prompt, config);
    const cached = await db.collection('ai_cache').findOne({ hash });

    if (cached && new Date(cached.expiresAt) > new Date()) {
      return cached.response;
    }

    return null;
  }

  private async cacheResult(prompt: string, config: AIConfig, response: string) {
    const hash = await this.hashPrompt(prompt, config);
    
    await db.collection('ai_cache').insertOne({
      prompt,
      config,
      response,
      hash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      createdAt: new Date()
    });
  }

  private async trackUsage(provider: string, config: AIConfig) {
    await db.collection('ai_usage').insertOne({
      userId: getCurrentUserId(),
      provider,
      model: config.model,
      timestamp: new Date()
    });
  }

  private async hashPrompt(prompt: string, config: AIConfig): Promise<string> {
    const input = JSON.stringify({ prompt, ...config });
    return crypto.createHash('sha256').update(input).digest('hex');
  }
}

export const aiGateway = new AIGateway();
```

---

## Gemini Provider Implementation

```typescript
// services/ai/providers/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiProvider implements AIProvider {
  name = 'gemini';
  private client: GoogleGenerativeAI;

  constructor() {
    this.client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  async complete(prompt: string, config: AIConfig): Promise<string> {
    const model = this.client.getGenerativeModel({ 
      model: config.model || "gemini-pro" 
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: config.temperature,
        maxOutputTokens: config.maxTokens,
        topP: config.topP,
        topK: config.topK
      },
      systemInstruction: config.systemPrompt
    });

    return result.response.text();
  }

  async *stream(prompt: string, config: AIConfig): AsyncIterable<string> {
    const model = this.client.getGenerativeModel({ 
      model: config.model || "gemini-pro" 
    });

    const result = await model.generateContentStream({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: config.temperature,
        maxOutputTokens: config.maxTokens
      }
    });

    for await (const chunk of result.stream) {
      yield chunk.text();
    }
  }

  async callFunction(
    prompt: string,
    functions: FunctionDefinition[],
    config: AIConfig
  ): Promise<FunctionCall> {
    // Gemini API support for function calling
    const model = this.client.getGenerativeModel({
      model: "gemini-pro",
      tools: [
        {
          functionDeclarations: functions.map(f => ({
            name: f.name,
            description: f.description,
            parameters: f.parameters
          }))
        }
      ]
    });

    const result = await model.generateContent(prompt);
    const call = result.response.functionCalls()?.[0];

    if (!call) {
      throw new Error("No function call received");
    }

    return {
      name: call.name,
      arguments: call.args || {}
    };
  }

  async getModels(): Promise<string[]> {
    // Return available models
    return ["gemini-pro", "gemini-pro-vision"];
  }

  async getUsage(): Promise<{ totalTokens: number; totalCost: number }> {
    // Gemini API doesn't have direct token counting
    // This would need to be tracked separately
    return { totalTokens: 0, totalCost: 0 };
  }
}
```

---

## AI Features Implementation

### 1. Resume Generator

```typescript
// services/ai/features/resume-generator.ts
export async function generateResume(userId: string, style?: 'professional' | 'creative' | 'minimal') {
  const user = await db.collection('users').findOne({ _id: userId });
  const resumeData = await db.collection('resume_data').findOne({ userId });

  const prompt = `
Generate a ${style || 'professional'} resume in Markdown format.

User Information:
- Name: ${user.profile.firstName} ${user.profile.lastName}
- Email: ${user.email}
- Summary: ${resumeData.summary}

Experience:
${resumeData.experience.map(exp => `- ${exp.title} at ${exp.company} (${exp.startDate} - ${exp.endDate})`).join('\n')}

Skills:
${resumeData.skills.map(skill => `- ${skill}`).join('\n')}

Education:
${resumeData.education.map(edu => `- ${edu.degree} in ${edu.field} from ${edu.school}`).join('\n')}

Projects:
${resumeData.projects.map(proj => `- ${proj.name}: ${proj.description}`).join('\n')}

Please generate a compelling resume that highlights these achievements.
  `;

  const resume = await aiGateway.complete(prompt, {
    config: {
      model: 'gemini-pro',
      temperature: 0.7,
      maxTokens: 2000,
      systemPrompt: 'You are an expert resume writer.'
    }
  });

  // Save generated resume
  await db.collection('resumes').insertOne({
    userId,
    title: `Resume - ${style || 'professional'}`,
    content: resume,
    style,
    generatedAt: new Date()
  });

  return resume;
}
```

### 2. AI Chat

```typescript
// routes/ai/chat.ts
router.post('/ai/chat', authenticate, async (req, res) => {
  const { message, conversationId } = req.body;
  
  // Save user message
  const conversation = await db.collection('conversations').findOne({ 
    _id: conversationId,
    userId: req.user.id 
  });

  if (!conversation) {
    return res.status(404).json({ error: 'Conversation not found' });
  }

  // Get conversation history for context
  const messages = conversation.messages.slice(-10); // Last 10 messages

  const prompt = buildPrompt(messages, message);

  // Stream response
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  let fullResponse = '';

  await aiGateway.stream(prompt, (chunk) => {
    fullResponse += chunk;
    res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
  });

  // Save assistant message
  await db.collection('conversations').updateOne(
    { _id: conversationId },
    {
      $push: {
        messages: [
          { role: 'user', content: message, timestamp: new Date() },
          { role: 'assistant', content: fullResponse, timestamp: new Date() }
        ]
      }
    }
  );

  res.write('data: [DONE]\n\n');
  res.end();
});

function buildPrompt(messages: any[], newMessage: string): string {
  const history = messages
    .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');

  return `${history}\n\nUser: ${newMessage}\n\nAssistant:`;
}
```

### 3. Career Coach

```typescript
// services/ai/features/career-coach.ts
export async function getCareerAdvice(userId: string, topic: string) {
  const user = await db.collection('users').findOne({ _id: userId });
  const career = await db.collection('career').findOne({ userId });

  const prompt = `
You are an expert career coach. 

User Profile:
- Name: ${user.profile.firstName} ${user.profile.lastName}
- Current Role: ${career.currentRole}
- Experience Years: ${career.experienceYears}
- Skills: ${career.skills.join(', ')}
- Goals: ${career.goals.join(', ')}

Topic: ${topic}

Provide personalized, actionable advice.
  `;

  return aiGateway.complete(prompt, {
    config: {
      temperature: 0.7,
      maxTokens: 1500,
      systemPrompt: 'You are an expert career coach with 20+ years of experience.'
    }
  });
}
```

---

## Adding New AI Provider

### Step 1: Implement Interface

```typescript
// services/ai/providers/openai.ts
export class OpenAIProvider implements AIProvider {
  name = 'openai';
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async complete(prompt: string, config: AIConfig): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: config.model || 'gpt-4',
      messages: [
        { role: 'system', content: config.systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: config.temperature,
      max_tokens: config.maxTokens
    });

    return response.choices[0].message.content;
  }

  // Implement other methods...
}
```

### Step 2: Register Provider

```typescript
// services/ai/gateway.ts
private registerProviders() {
  this.providers.set('gemini', new GeminiProvider());
  this.providers.set('openai', new OpenAIProvider());
  this.providers.set('claude', new ClaudeProvider());
}
```

### Step 3: Set API Key

```env
OPENAI_API_KEY=sk_...
```

### Step 4: Select Provider

```bash
# In database or config
ai.config.provider = 'openai'
```

Done! No application code changes needed.

---

## Configuration

### User Settings

```typescript
// Admin panel allows users to configure:
{
  provider: 'gemini', // or 'openai', 'claude'
  model: 'gemini-pro',
  temperature: 0.7,
  maxTokens: 2000,
  enableCaching: true,
  cacheTTL: 604800, // 7 days
  costBudget: 100, // monthly
}
```

---

## Monitoring & Analytics

```typescript
// Track AI usage
GET /api/v1/ai/usage?from=2024-01-01&to=2024-12-31

Response:
{
  totalRequests: 1500,
  totalTokensUsed: 250000,
  totalCost: 45.50,
  byProvider: {
    gemini: { requests: 1000, cost: 0 },
    openai: { requests: 500, cost: 45.50 }
  },
  byFeature: {
    'resume-generator': { requests: 100, cost: 5 },
    'ai-chat': { requests: 1000, cost: 35 },
    'career-coach': { requests: 400, cost: 5.50 }
  }
}
```

---

## Best Practices

1. **Always use system prompts** - Guide AI behavior
2. **Cache results** - Reduce costs and improve performance
3. **Validate responses** - Check for errors and hallucinations
4. **Track usage** - Monitor costs and prevent overspending
5. **Version prompts** - Keep history of prompt changes
6. **Test thoroughly** - Different models behave differently
7. **Handle errors gracefully** - API can fail
8. **Set reasonable limits** - Max tokens, temperature
9. **Use streaming** - For better UX with long responses
10. **Implement fallbacks** - Use different provider if one fails

---

## Troubleshooting

### "API Key not found"
```bash
# Ensure .env.local has the key
echo "GEMINI_API_KEY=your_key" >> .env.local
```

### "No response from provider"
```typescript
// Add retry logic
async function completeWithRetry(prompt: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await aiGateway.complete(prompt);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}
```

### "High costs"
```typescript
// Implement cost limits
if (monthlyUsage.cost > config.costBudget) {
  throw new Error('Monthly AI budget exceeded');
}
```

---

## Next Steps

1. [Setup Gemini API](https://aistudio.google.com)
2. Implement AI Gateway service
3. Create AI features (Resume Generator, Chat, etc.)
4. Setup AI configuration UI
5. Add cost tracking and monitoring

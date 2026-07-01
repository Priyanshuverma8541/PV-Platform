export interface Prompt {
  id: string;
  name: string;
  description: string;
  template: string;
  variables: string[];
  category: string;
  tags: string[];
}

export interface PromptTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
}

export class PromptManager {
  private prompts: Map<string, Prompt> = new Map();

  async createPrompt(prompt: Omit<Prompt, 'id'>): Promise<Prompt> {
    const newPrompt: Prompt = {
      ...prompt,
      id: this.generateId()
    };
    this.prompts.set(newPrompt.id, newPrompt);
    return newPrompt;
  }

  async getPrompt(id: string): Promise<Prompt | null> {
    return this.prompts.get(id) || null;
  }

  async getPromptsByCategory(category: string): Promise<Prompt[]> {
    return Array.from(this.prompts.values()).filter(p => p.category === category);
  }

  async searchPrompts(query: string): Promise<Prompt[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.prompts.values()).filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  async updatePrompt(id: string, updates: Partial<Prompt>): Promise<Prompt | null> {
    const prompt = this.prompts.get(id);
    if (!prompt) return null;

    const updated = { ...prompt, ...updates, id };
    this.prompts.set(id, updated);
    return updated;
  }

  async deletePrompt(id: string): Promise<boolean> {
    return this.prompts.delete(id);
  }

  interpolate(template: string, variables: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables[key] || match;
    });
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}

export const promptManager = new PromptManager();

// Pre-defined prompts
export const DEFAULT_PROMPTS: Omit<Prompt, 'id'>[] = [
  {
    name: 'Resume Generator',
    description: 'Generate a professional resume',
    template: 'Generate a {{style}} resume for {{name}} with the following information:\n\n{{experience}}\n\n{{skills}}\n\n{{education}}',
    variables: ['style', 'name', 'experience', 'skills', 'education'],
    category: 'resume',
    tags: ['resume', 'career', 'professional']
  },
  {
    name: 'Cover Letter Generator',
    description: 'Generate a cover letter for job application',
    template: 'Generate a cover letter for {{name}} applying for {{position}} at {{company}}.\n\nJob Description:\n{{jobDescription}}\n\nApplicant Experience:\n{{experience}}',
    variables: ['name', 'position', 'company', 'jobDescription', 'experience'],
    category: 'career',
    tags: ['cover-letter', 'job', 'application']
  },
  {
    name: 'Career Coach',
    description: 'Get career advice',
    template: 'You are an expert career coach. Provide advice on {{topic}} for someone with {{experience}} years of experience in {{field}}.',
    variables: ['topic', 'experience', 'field'],
    category: 'career',
    tags: ['career', 'advice', 'coaching']
  }
];
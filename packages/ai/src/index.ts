import { apiClient } from '@pv/api-client';
import type { AIConfig } from '@pv/types';

type ApiEnvelope<T> = {
  data?: T;
  content?: string;
  response?: string;
  conversationId?: string;
};

export class AIService {
  private config: AIConfig | null = null;

  async getConfig(): Promise<AIConfig> {
    if (!this.config) {
      const response = await apiClient.get<ApiEnvelope<AIConfig> | AIConfig>('/ai/config');
      this.config = 'data' in response.data && response.data.data ? response.data.data : response.data as AIConfig;
    }
    return this.config;
  }

  async updateConfig(config: Partial<AIConfig>): Promise<AIConfig> {
    const response = await apiClient.put<ApiEnvelope<AIConfig> | AIConfig>('/ai/config', config);
    this.config = 'data' in response.data && response.data.data ? response.data.data : response.data as AIConfig;
    return this.config;
  }

  async chat(message: string, conversationId?: string): Promise<{
    response: string;
    conversationId: string;
  }> {
    const response = await apiClient.post<ApiEnvelope<{ response: string; conversationId: string }> | { response: string; conversationId: string }>('/ai/chat', {
      message,
      conversationId,
    });

    const payload = 'data' in response.data && response.data.data ? response.data.data : response.data;
    return {
      response: payload.response || '',
      conversationId: payload.conversationId || conversationId || '',
    };
  }

  async generate(prompt: string, options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
  }): Promise<string> {
    const response = await apiClient.post<ApiEnvelope<{ content: string }> | { content: string }>('/ai/generate', {
      prompt,
      ...options,
    });

    const payload = 'data' in response.data && response.data.data ? response.data.data : response.data;
    return payload.content || '';
  }

  async generateResume(userData: any, style: 'professional' | 'creative' | 'minimal' = 'professional'): Promise<string> {
    const prompt = `
Generate a ${style} resume in Markdown format.

User Information:
- Name: ${userData.profile?.firstName || ''} ${userData.profile?.lastName || ''}
- Email: ${userData.email}
- Summary: ${userData.summary || ''}

Experience:
${userData.experience?.map((exp: any) => `- ${exp.title} at ${exp.company} (${exp.startDate} - ${exp.endDate || 'Present'})`).join('\n') || 'No experience listed'}

Skills:
${userData.skills?.map((skill: any) => `- ${skill.name}: ${skill.level}`).join('\n') || 'No skills listed'}

Education:
${userData.education?.map((edu: any) => `- ${edu.degree} in ${edu.field} from ${edu.school}`).join('\n') || 'No education listed'}

Projects:
${userData.projects?.map((proj: any) => `- ${proj.title}: ${proj.description}`).join('\n') || 'No projects listed'}

Please generate a compelling resume that highlights these achievements.
    `;

    return this.generate(prompt, {
      model: 'gemini-pro',
      temperature: 0.7,
      maxTokens: 2000,
      systemPrompt: 'You are an expert resume writer. Generate professional, well-formatted resumes.',
    });
  }

  async generateCoverLetter(
    userData: any,
    jobDetails: { title: string; company: string; description: string }
  ): Promise<string> {
    const prompt = `
Generate a professional cover letter for the following job application:

Job Title: ${jobDetails.title}
Company: ${jobDetails.company}
Job Description: ${jobDetails.description}

Applicant Information:
- Name: ${userData.profile?.firstName || ''} ${userData.profile?.lastName || ''}
- Email: ${userData.email}
- Summary: ${userData.summary || ''}

Experience:
${userData.experience?.map((exp: any) => `- ${exp.title} at ${exp.company}`).join('\n') || ''}

Skills:
${userData.skills?.map((skill: any) => `- ${skill.name}`).join('\n') || ''}

Generate a compelling cover letter that highlights relevant experience and skills for this specific role.
    `;

    return this.generate(prompt, {
      model: 'gemini-pro',
      temperature: 0.7,
      maxTokens: 1500,
      systemPrompt: 'You are an expert cover letter writer. Generate professional, personalized cover letters.',
    });
  }

  async getCareerAdvice(userData: any, topic: string): Promise<string> {
    const prompt = `
You are an expert career coach with 20+ years of experience.

User Profile:
- Name: ${userData.profile?.firstName || ''} ${userData.profile?.lastName || ''}
- Current Role: ${userData.currentRole || 'Not specified'}
- Experience Years: ${userData.experienceYears || 'Not specified'}
- Skills: ${userData.skills?.map((skill: any) => skill.name).join(', ') || 'Not specified'}
- Goals: ${userData.goals?.join(', ') || 'Not specified'}

Topic: ${topic}

Provide personalized, actionable career advice.
    `;

    return this.generate(prompt, {
      model: 'gemini-pro',
      temperature: 0.7,
      maxTokens: 1500,
      systemPrompt: 'You are an expert career coach with 20+ years of experience in tech and business.',
    });
  }

  async getProviders(): Promise<string[]> {
    const response = await apiClient.get<ApiEnvelope<string[]> | string[]>('/ai/providers');
    return Array.isArray(response.data) ? response.data : response.data.data || [];
  }
}

export const aiService = new AIService();
export default aiService;

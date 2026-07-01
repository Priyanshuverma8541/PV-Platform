import type { BuiltPrompt } from '../../services/prompt.service.js';

export function careerCoachPrompt(data: Record<string, unknown>): BuiltPrompt {
  const { currentRole, skills, experience, targetRole, question, location } = data;

  return {
    systemPrompt: `You are an expert tech career coach with deep knowledge of the 
software industry, Salesforce ecosystem, and Indian tech market (especially Kolkata). 
You give honest, specific, and actionable career advice. You understand both the 
technical and business sides of tech careers. 
Always be encouraging but realistic.`,

    userPrompt: `Career coaching request:

Current Role/Status: ${currentRole ?? 'Not specified'}
Experience: ${experience ?? 'Not specified'}
Skills: ${Array.isArray(skills) ? skills.join(', ') : skills ?? 'Not specified'}
Target Role: ${targetRole ?? 'Not specified'}
Location: ${location ?? 'Kolkata, India'}

Question: ${question ?? 'What should I focus on next for career growth?'}

Provide specific, actionable advice including:
1. Direct answer to the question
2. Skill gaps to address (if any)
3. Immediate next steps (this week)
4. 3-month action plan
5. Resources or certifications to pursue`,
  };
}

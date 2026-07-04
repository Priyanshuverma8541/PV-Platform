import type { BuiltPrompt } from '../../services/prompt.service';

export function proposalPrompt(data: Record<string, unknown>): BuiltPrompt {
  const { clientName, projectName, projectDescription, budget, timeline, mySkills, myExperience } = data;

  return {
    systemPrompt: `You are an expert freelance proposal writer who helps developers and 
tech professionals win clients. You write compelling, professional proposals that 
focus on client value, not just technical specs. Keep proposals concise, confident, 
and conversion-focused. Use clear sections with a persuasive opening hook.`,

    userPrompt: `Write a professional freelance proposal for:

Client: ${clientName ?? 'Potential Client'}
Project: ${projectName ?? 'Project'}
Description: ${projectDescription ?? 'Not provided'}
Budget: ${budget ?? 'To be discussed'}
Timeline: ${timeline ?? 'To be discussed'}

My Background:
Skills: ${mySkills ?? 'Full Stack Development, Salesforce, MERN Stack'}
Experience: ${myExperience ?? '3+ years in web development'}

Create a winning proposal with:
1. Opening hook (why I'm the right fit)
2. Understanding of their problem
3. My proposed solution (brief, client-friendly)
4. Why choose me (key differentiators)
5. Deliverables and timeline
6. Investment (pricing)
7. Next steps / call to action

Keep it under 400 words. Professional but warm tone.`,
  };
}

import type { BuiltPrompt } from '../../services/prompt.service';

export function crmPrompt(data: Record<string, unknown>): BuiltPrompt {
  const { clientData, task, context } = data;

  const tasks: Record<string, string> = {
    summary: 'a client relationship summary',
    next_steps: 'recommended next steps for this client',
    email_draft: 'a client follow-up email',
    proposal: 'a tailored proposal based on client needs',
    analysis: 'a client analysis and opportunity assessment',
  };

  const taskDescription = tasks[String(task)] ?? 'insights about this client';

  return {
    systemPrompt: `You are an expert CRM consultant and business development advisor. 
You analyze client data and relationships to provide actionable insights that 
help close deals, maintain relationships, and grow revenue. 
Be specific, strategic, and client-focused.`,

    userPrompt: `Generate ${taskDescription}:

Client Data:
${typeof clientData === 'object' ? JSON.stringify(clientData, null, 2) : clientData ?? 'Not provided'}

Additional Context: ${context ?? 'None'}

Provide concise, actionable insights tailored to this specific client situation.`,
  };
}

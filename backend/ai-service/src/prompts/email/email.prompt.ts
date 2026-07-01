import type { BuiltPrompt } from '../../services/prompt.service.js';

export function emailPrompt(data: Record<string, unknown>): BuiltPrompt {
  const { type, recipient, context, tone, senderName } = data;

  const emailTypes: Record<string, string> = {
    outreach: 'a professional cold outreach email to a potential client or employer',
    followup: 'a polite and professional follow-up email',
    cover_letter: 'a compelling cover letter email',
    thank_you: 'a professional thank-you email after a meeting or interview',
    introduction: 'a professional self-introduction email',
    proposal_followup: 'a follow-up email after sending a project proposal',
  };

  const emailType = emailTypes[String(type)] ?? 'a professional email';

  return {
    systemPrompt: `You are an expert business communication writer. You write concise, 
professional, and effective emails that get responses. Every email should have a 
clear purpose, strong subject line, and a specific call to action. 
Avoid generic phrases. Be direct and human.`,

    userPrompt: `Write ${emailType} for:

Sender: ${senderName ?? 'Priyanshu Verma'}
Recipient: ${recipient ?? 'Recipient'}
Context / Purpose: ${context ?? 'Not provided'}
Tone: ${tone ?? 'Professional and friendly'}

Provide:
1. Subject line (compelling, specific)
2. Email body (concise, max 200 words)
3. Professional sign-off`,
  };
}

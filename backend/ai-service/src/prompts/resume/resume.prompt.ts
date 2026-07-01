import type { BuiltPrompt } from '../../services/prompt.service.js';

export function resumePrompt(data: Record<string, unknown>): BuiltPrompt {
  const { name, role, skills, experience, education, projects, targetRole, tone } = data;

  return {
    systemPrompt: `You are an expert resume writer with 10+ years of experience helping 
software engineers, Salesforce developers, and tech professionals land top roles. 
You write ATS-optimized, achievement-focused resumes. Always use strong action verbs, 
quantify impact where possible, and tailor content to the target role.
Return the resume in clean markdown format with clear sections.`,

    userPrompt: `Generate a professional resume for the following person:

Name: ${name ?? 'Not provided'}
Target Role: ${targetRole ?? role ?? 'Software Developer'}
Tone: ${tone ?? 'Professional'}

Skills: ${Array.isArray(skills) ? skills.join(', ') : skills ?? 'Not provided'}

Work Experience:
${experience ?? 'Not provided'}

Education:
${education ?? 'Not provided'}

Key Projects:
${projects ?? 'Not provided'}

Create a complete, ATS-optimized resume with:
- Professional summary (3-4 lines, tailored to target role)
- Skills section (grouped by category)
- Work Experience (with bullet points using STAR format)
- Projects (with tech stack and impact)
- Education
- Certifications (if any mentioned)`,
  };
}

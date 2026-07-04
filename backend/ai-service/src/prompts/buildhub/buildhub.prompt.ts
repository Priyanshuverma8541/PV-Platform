import type { BuiltPrompt } from '../../services/prompt.service';

export function buildhubPrompt(data: Record<string, unknown>): BuiltPrompt {
  const { type, description, techStack, features, industry } = data;

  const generationTypes: Record<string, string> = {
    schema: 'a MongoDB database schema',
    api: 'a REST API specification',
    architecture: 'a software architecture document',
    components: 'React component structure',
    userStories: 'user stories and acceptance criteria',
    full: 'a complete software specification',
  };

  const genType = generationTypes[String(type)] ?? 'a software specification';

  return {
    systemPrompt: `You are a senior software architect with expertise in MERN stack, 
Salesforce, and modern SaaS architecture. You design clean, scalable systems. 
When generating code or schemas, follow best practices: TypeScript, clean naming, 
proper relationships, security considerations. Output should be immediately usable.`,

    userPrompt: `Generate ${genType} for the following software:

Description: ${description ?? 'Not provided'}
Industry: ${industry ?? 'General'}
Tech Stack: ${techStack ?? 'MERN (MongoDB, Express, React, Node.js)'}
Key Features: ${Array.isArray(features) ? features.join(', ') : features ?? 'Not specified'}

Generate a complete, production-ready ${genType} with:
- Clear structure and naming conventions
- All necessary fields/endpoints/components
- TypeScript types where applicable
- Comments explaining key decisions
- Security and scalability considerations`,
  };
}

export interface AgentConfig {
  basePrompt: string;
  greeting: string;
  context?: string;
  questions?: string;
  customInstructions?: string;
  language: { 
    code: string;
    name: string;
  };
  voice: { 
    name: string;
    languageCode: string;
  };
}
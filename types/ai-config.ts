export interface AIConfig {
  id: string;
  name: string;
  greeting: string;
  context: string;
  questions: string | null;  // Changed from string | undefined to string | null
  userNumbers: {
    telyxNumber: string;
  }[];
}

export interface UserNumber {
  id: string;
  telyxNumber: string;
  aiConfigId: string | null;
  aiConfig: AIConfig | null;
}
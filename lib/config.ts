export const API_ROUTES = {
  AI_CONFIGS: '/api/ai-configs',
  AI_CONFIG: (id: string) => `/api/ai-configs/${id}`,
  SYSTEM_PROMPT: (id: string) => `/api/ai-configs/${id}/system-prompt`,
  AGENT_CONFIG: (agentId: string) => `/api/agents/${agentId}/config`,
  INTERNAL: {
    CALL: '/api/call'
  }
} as const;
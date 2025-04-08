// // lib/utils/formatSystemPrompt.ts
// export const formatSystemPrompt = (config: AgentConfig) => {
//   // Base structure that always exists
//   const prompt = `${config.basePrompt}

// Instructions for this conversation:
// 1. Greeting: "${config.greeting}"`;

//   // Optional elements
//   const sections = [
//     config.context && `2. Context: ${config.context}`,
//     config.customInstructions && `3. Special Instructions: ${config.customInstructions}`,
//     config.questions && `4. Follow-up Questions: ${config.questions}`
//   ].filter(Boolean);

//   return `${prompt}\n\n${sections.join('\n\n')}`;
// };
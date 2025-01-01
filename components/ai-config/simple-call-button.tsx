import { useState } from "react";
import { PhoneCall, PhoneOff } from "lucide-react";

import { AIConfig } from "@/types/ai-config";
import { endCall, startCall } from "@/lib/callFunctions";
import { Button } from "@/components/ui/button";

interface SimpleCallButtonProps {
  config: AIConfig;
}

export function SimpleCallButton({ config }: SimpleCallButtonProps) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCall = async () => {
    setIsLoading(true);
    try {
      if (!isCallActive) {
        const systemPrompt = `
You are a voice AI assistant. Follow these instructions carefully:

1. Start the conversation with this greeting:
${config.greeting}

2. Context about who you are and what you know:
${config.context}

${
  config.questions
    ? `3. After greeting, ask these questions one by one. Wait for user responses:
${config.questions}`
    : ""
}

Remember to:
- Keep responses brief and conversational
- Listen carefully to user responses
- Ask questions naturally, one at a time
- Be friendly and professional`;

        await startCall(
          {
            onStatusChange: () => {},
            onTranscriptChange: () => {},
          },
          {
            systemPrompt,
            model: "fixie-ai/ultravox-70B",
            languageHint: "en",
            voice: "terrence",
            temperature: 0.7,
          },
        );
        setIsCallActive(true);
      } else {
        await endCall();
        setIsCallActive(false);
      }
    } catch (error) {
      console.error("Call error:", error);
    }
    setIsLoading(false);
  };

  return (
    <Button
      variant={isCallActive ? "destructive" : "default"}
      onClick={handleCall}
      disabled={isLoading}
    >
      {isCallActive ? (
        <PhoneOff className="mr-2 size-4" />
      ) : (
        <PhoneCall className="mr-2 size-4" />
      )}
      {isCallActive ? "End Call" : "Start Call"}
    </Button>
  );
}

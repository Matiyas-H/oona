"use client";

import { useEffect, useState } from "react";
import { AIConfig } from "@/types/ai-config";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import VoiceChat from "@/components/UltravoxChat";
import { useToast } from "@/components/ui/use-toast";

interface CallDialogProps {
  config: AIConfig;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CallDialog({ config, open, onOpenChange }: CallDialogProps) {
  const [systemPrompt, setSystemPrompt] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    if (open && config.id) {
      fetch(`/api/ai-configs/${config.id}/system-prompt`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            throw new Error(data.error);
          }
          setSystemPrompt(data.systemPrompt || "");
        })
        .catch((error) => {
          console.error("Failed to fetch system prompt:", error);
          toast({
            title: "Error",
            description: "Failed to initialize call configuration",
            variant: "destructive",
          });
          onOpenChange(false);
        });
    }
  }, [config.id, open, onOpenChange, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        {systemPrompt && (
          <VoiceChat
            config={{
              systemPrompt,
              greeting: config.greeting,
              context: config.context,
              questions: config.questions || undefined,
              languageHint: "en",
              voice: "terrence",
              temperature: 0.7, // Ensure this is always a number
              model: "gpt-4",
            }}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

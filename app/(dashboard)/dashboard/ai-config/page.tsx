"use client";

import { useState } from "react";
import { Bot, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

interface UserNumber {
  id: string;
  telyxNumber: string;
  aiGreeting: string | null;
  aiContext: string | null;
  userName: string | null;
  aiQuestions: string | null;
}

interface AIConfigDisplayProps {
  userNumber: UserNumber;
  hasConfiguration: boolean;
}

export function AIConfigDisplay({
  userNumber,
  hasConfiguration,
}: AIConfigDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [config, setConfig] = useState({
    aiGreeting: userNumber.aiGreeting || "",
    aiContext: userNumber.aiContext || "",
    userName: userNumber.userName || "",
    aiQuestions: userNumber.aiQuestions || "",
  });
  console.log("Current config state:", config);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/user/ai-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telyxNumber: userNumber.telyxNumber,
          ...config,
        }),
      });

      if (!response.ok) throw new Error();

      toast({
        title: "Configuration saved",
        description:
          "Your AI assistant has been updated with your preferences.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your AI configuration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!hasConfiguration && !isEditing) {
    return (
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="post" />
        <EmptyPlaceholder.Title>
          Configure Your AI Assistant
        </EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          Set up how your AI assistant should greet callers and handle your
          calls.
        </EmptyPlaceholder.Description>
        <Button onClick={() => setIsEditing(true)} className="w-full sm:w-auto">
          Configure AI Assistant
        </Button>
      </EmptyPlaceholder>
    );
  }

  if (isEditing) {
    return (
      <Card>
        <CardHeader className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Bot className="size-6" />
              <CardTitle>AI Assistant Configuration</CardTitle>
            </div>
            <CardDescription>
              Configure how your AI assistant handles calls
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Name</label>
                <Input
                  placeholder="Enter your name"
                  value={config.userName}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      userName: e.target.value,
                    }))
                  }
                />
                <p className="text-sm text-muted-foreground">
                  This name will be used by the AI assistant when referring to
                  you.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Initial Greeting</label>
                <Textarea
                  placeholder="Hello! I'm the AI assistant for [User]. How can I help you today?"
                  className="min-h-[100px] resize-y"
                  value={config.aiGreeting}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      aiGreeting: e.target.value,
                    }))
                  }
                />
                <p className="text-sm text-muted-foreground">
                  This is how your AI assistant will greet callers.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  About You & Your Preferences
                </label>
                <Textarea
                  placeholder="I handle scheduling, message taking, and prioritize urgent calls about..."
                  className="min-h-[150px] resize-y"
                  value={config.aiContext}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      aiContext: e.target.value,
                    }))
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Help your AI assistant understand your preferences and how to
                  handle different types of calls.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Questions to Ask Callers
                </label>
                <Textarea
                  placeholder="What's your name? What's the purpose of your call?"
                  className="min-h-[150px] resize-y"
                  value={config.aiQuestions}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      aiQuestions: e.target.value,
                    }))
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Specify questions that your AI assistant should ask callers to
                  gather important information.
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditing(false)}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? "Saving..." : "Save Configuration"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Bot className="size-6" />
            <CardTitle>AI Assistant Configuration</CardTitle>
          </div>
          <CardDescription>
            Your AI assistant&apos;s current configuration
          </CardDescription>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsEditing(true)}
          className="w-full sm:w-auto"
        >
          <Pencil className="mr-2 size-4" />
          Edit Configuration
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Your Name</h3>
          <div className="rounded-md bg-muted p-4 text-sm">
            {config.userName || "Not set"}
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Initial Greeting</h3>
          <div className="rounded-md bg-muted p-4 text-sm">
            {config.aiGreeting}
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">About You & Your Preferences</h3>
          <div className="whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">
            {config.aiContext}
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Questions to Ask Callers</h3>
          <div className="whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">
            {config.aiQuestions}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

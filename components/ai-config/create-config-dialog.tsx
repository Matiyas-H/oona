"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface CreateConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateConfigDialog({ open, onOpenChange }: CreateConfigDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    greeting: "",
    context: "",
    questions: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/ai-configs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error();

      toast({
        title: "Configuration created",
        description: "Your new AI configuration has been created successfully.",
      });
      onOpenChange(false);
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create the configuration.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New AI Configuration</DialogTitle>
          <DialogDescription>
            Create a new configuration for your AI assistant
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Configuration Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Sales Assistant"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Initial Greeting</label>
            <Textarea
              value={formData.greeting}
              onChange={(e) => setFormData(prev => ({ ...prev, greeting: e.target.value }))}
              placeholder="Hello! I'm the AI assistant..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Context Information</label>
            <Textarea
              value={formData.context}
              onChange={(e) => setFormData(prev => ({ ...prev, context: e.target.value }))}
              placeholder="I handle scheduling, message taking..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Questions for Callers</label>
            <Textarea
              value={formData.questions}
              onChange={(e) => setFormData(prev => ({ ...prev, questions: e.target.value }))}
              placeholder="What's your name? What's the purpose..."
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Configuration"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
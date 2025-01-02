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
          <DialogTitle>Create New Voice AI Agent</DialogTitle>
          <DialogDescription>
            Set up a new AI agent to handle your calls
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Agent Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Executive Assistant, Sales Representative"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Opening Message</label>
            <Textarea
              value={formData.greeting}
              onChange={(e) => setFormData(prev => ({ ...prev, greeting: e.target.value }))}
              placeholder="The first message your AI agent will say when answering a call..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Agent Background & Skills</label>
            <Textarea
              value={formData.context}
              onChange={(e) => setFormData(prev => ({ ...prev, context: e.target.value }))}
              placeholder="Define the agent's role, expertise, and capabilities..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Information to Collect</label>
            <Textarea
              value={formData.questions}
              onChange={(e) => setFormData(prev => ({ ...prev, questions: e.target.value }))}
              placeholder="Specify what information the agent should gather from callers..."
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
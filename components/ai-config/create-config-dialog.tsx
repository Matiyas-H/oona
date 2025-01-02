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
      <DialogContent className="max-h-[85vh] w-[90%] max-w-[800px] overflow-y-auto p-6">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl">Create New Voice AI Agent</DialogTitle>
          <DialogDescription className="text-lg">
            Set up a new AI agent to handle your calls
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="text-lg font-medium">Agent Name</label>
            <Input
              className="h-14 text-xl"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Executive Assistant, Sales Representative"
              required
            />
          </div>

          <div className="space-y-4">
            <label className="text-lg font-medium">Opening Message</label>
            <Textarea
              className="min-h-[250px] resize-y text-xl leading-relaxed"
              value={formData.greeting}
              onChange={(e) => setFormData(prev => ({ ...prev, greeting: e.target.value }))}
              placeholder="The first message your AI agent will say when answering a call..."
              required
            />
          </div>

          <div className="space-y-4">
            <label className="text-lg font-medium">Agent Background & Skills</label>
            <Textarea
              className="min-h-[500px] resize-y text-xl leading-relaxed"
              value={formData.context}
              onChange={(e) => setFormData(prev => ({ ...prev, context: e.target.value }))}
              placeholder="Define the agent's role, expertise, and capabilities..."
              required
            />
          </div>

          <div className="space-y-4">
            <label className="text-lg font-medium">Information to Collect</label>
            <Textarea
              className="min-h-[500px] resize-y text-xl leading-relaxed"
              value={formData.questions}
              onChange={(e) => setFormData(prev => ({ ...prev, questions: e.target.value }))}
              placeholder="Specify what information the agent should gather from callers..."
            />
          </div>

          <div className="flex justify-end space-x-4 pt-8">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="h-14 px-10 text-lg"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="h-14 px-10 text-lg"
            >
              {loading ? "Creating..." : "Create Configuration"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
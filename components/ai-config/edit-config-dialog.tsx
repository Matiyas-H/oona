"use client";

import { useState } from "react";

import { AIConfig } from "@/types/ai-config";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface EditConfigDialogProps {
  config: AIConfig;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditConfigDialog({
  config,
  open,
  onOpenChange,
}: EditConfigDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: config.name,
    greeting: config.greeting,
    context: config.context,
    questions: config.questions || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/ai-configs/${config.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error();

      toast({
        title: "Configuration updated",
        description: "Your AI configuration has been updated successfully.",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update the configuration.",
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
          <DialogTitle>Edit AI Configuration</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Organization Name</label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g., Acme Corp Support, Cleveland Medical Center"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Initial Greeting</label>
            <Textarea
              value={formData.greeting}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, greeting: e.target.value }))
              }
              placeholder="The first message your AI agent will say when answering a call..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Business Context & Capabilities</label>
            <Textarea
              value={formData.context}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, context: e.target.value }))
              }
              placeholder="Define business operations, services offered, key information to provide, and handling capabilities..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Call Flow Guidelines</label>
            <Textarea
              value={formData.questions}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, questions: e.target.value }))
              }
              placeholder="Specify interaction flow, key points to address, and information to collect..."
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
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

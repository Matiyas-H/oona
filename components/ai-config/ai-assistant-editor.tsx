"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Save, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

export function AIAssistantEditor({ id }: { id: string }) {
  const { data: config, isLoading } = useQuery({
    queryKey: ["ai-config", id],
    queryFn: async () => {
      const response = await fetch(`/api/ai-configs/${id}`);
      return response.json();
    },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(config || {});
  const { toast } = useToast();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{config.name}</h2>
        <div className="space-x-2">
          <Button
            variant={isEditing ? "default" : "outline"}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <>
                <Save className="mr-2 size-4" />
                Save Changes
              </>
            ) : (
              <>
                <Pencil className="mr-2 size-4" />
                Edit Assistant
              </>
            )}
          </Button>
          <Button variant="destructive">
            <Trash2 className="mr-2 size-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Add form fields for editing */}
        {/* Add sections for viewing assigned numbers */}
        {/* Add statistics or usage information */}
      </div>
    </div>
  );
}

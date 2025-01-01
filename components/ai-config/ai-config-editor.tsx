"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Save, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface AIConfigEditorProps {
  id: string;
  onDelete: () => void;
}

export function AIConfigEditor({ id, onDelete }: AIConfigEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  const { data: config, isLoading } = useQuery({
    queryKey: ["ai-config", id],
    queryFn: async () => {
      const response = await fetch(`/api/ai-configs/${id}`);
      return response.json();
    },
  });

  const [formData, setFormData] = useState(config || {});

  if (isLoading) return <div>Loading...</div>;

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/ai-configs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error();

      toast({
        title: "Changes saved",
        description: "Your AI assistant has been updated.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/ai-configs/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();

      toast({
        title: "Assistant deleted",
        description: "The AI assistant has been deleted.",
      });
      onDelete();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete assistant.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Editor content */}
      {/* ... Add form fields similar to create dialog but with edit/save functionality */}
    </div>
  );
}

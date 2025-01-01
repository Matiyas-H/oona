"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, PhoneCall, Trash2 } from "lucide-react";

import { AIConfig, UserNumber } from "@/types/ai-config";
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
import { useToast } from "@/components/ui/use-toast";

import { AssignConfigDialog } from "./assign-config-dialog";
import { AssignNumbersDialog } from "./assign-numbers-dialog";
import { CallDialog } from "./call-dialog";
import { EditConfigDialog } from "./edit-config-dialog";
import { SimpleCallButton } from "./simple-call-button";

interface AIConfigItemProps {
  id: string; // Change to accept id instead of full config
  onDelete: () => void;
}

export function AIConfigItem({ id, onDelete }: AIConfigItemProps) {
  const {
    data: config,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["ai-config", id],
    queryFn: async () => {
      const response = await fetch(`/api/ai-configs/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch config: ${response.statusText}`);
      }

      return response.json();
    },
    retry: 1,
    staleTime: 1000 * 60,
  });

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showCallDialog, setShowCallDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-lg border">
        <div className="flex items-center gap-2">
          <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Error loading config:", error);
    return (
      <div className="flex h-[200px] items-center justify-center rounded-lg border">
        <span className="text-sm text-muted-foreground">
          Failed to load configuration. Please try again.
        </span>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-lg border">
        <span className="text-sm text-muted-foreground">
          Failed to load configuration
        </span>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/ai-configs/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();

      toast({
        title: "Configuration deleted",
        description: "The AI configuration has been deleted successfully.",
      });

      onDelete();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the configuration.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="space-y-6 rounded-md border border-border bg-card p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col justify-between gap-2 border-b pb-4 sm:flex-row sm:items-center">
          <h3 className="text-lg font-semibold sm:text-xl">{config?.name}</h3>
          <span className="w-fit rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
            {config?.userNumbers.length > 0
              ? `${config.userNumbers.length} number(s)`
              : "Not assigned"}
          </span>
        </div>

        <div className="grid gap-6">
          {/* Sections with responsive padding and font sizes */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground sm:text-sm">
              Initial Greeting
            </h4>
            <p className="rounded-md bg-muted/50 p-3 text-sm">
              {config?.greeting}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground sm:text-sm">
              Context Information
            </h4>
            <div className="min-h-[100px] rounded-md bg-muted/50 p-3 sm:min-h-[120px] sm:p-4">
              <p className="whitespace-pre-wrap text-sm">{config?.context}</p>
            </div>
          </div>

          {config?.questions && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground sm:text-sm">
                Questions for Callers
              </h4>
              <div className="min-h-[100px] rounded-md bg-muted/50 p-3 sm:min-h-[120px] sm:p-4">
                <p className="whitespace-pre-wrap text-sm">
                  {config?.questions}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions Section */}
        <div className="flex justify-end gap-2 border-t pt-4">
          <SimpleCallButton config={config} />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAssignDialog(true)}
            className="text-xs sm:text-sm"
          >
            <PhoneCall className="mr-2 size-3 sm:size-4" />
            Assign Numbers
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEditDialog(true)}
            className="text-xs sm:text-sm"
          >
            <Pencil className="mr-2 size-3 sm:size-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            className="text-xs sm:text-sm"
          >
            <Trash2 className="mr-2 size-3 sm:size-4" />
            Delete
          </Button>
        </div>
      </div>

      <AssignNumbersDialog
        open={showAssignDialog}
        onOpenChange={setShowAssignDialog}
        configId={id}
        currentNumbers={config?.userNumbers || []}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this AI configuration.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditConfigDialog
        config={config}
        open={showEditDialog}
        onOpenChange={(open) => {
          setShowEditDialog(open);
          if (!open) {
            // Just refetch the data without reloading the page
            queryClient.invalidateQueries({ queryKey: ["ai-config", id] });
            queryClient.invalidateQueries({ queryKey: ["ai-configs"] });
          }
        }}
      />
    </>
  );
}

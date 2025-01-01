"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { AIConfigItem } from "@/components/ai-config/ai-config-item";
import { AIConfigsList } from "@/components/ai-config/ai-config-list";
import { CreateConfigDialog } from "@/components/ai-config/create-config-dialog";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";

// Remove this interface as it's now defined in the component file
// export interface CreateConfigDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onSuccess: () => void;
// }

export default function AIConfigPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { toast } = useToast();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 2,
        staleTime: 1000 * 60, // Consider data fresh for 1 minute
        gcTime: 1000 * 60 * 5, // Keep unused data in cache for 5 minutes
      },
      mutations: {
        onError: (error) => {
          console.error("Query error:", error);
          toast({
            title: "Error",
            description: "Failed to fetch data. Please try again.",
            variant: "destructive",
          });
        },
      },
    },
  });

  const handleSuccess = () => {
    setShowCreateDialog(false);
    queryClient.invalidateQueries({ queryKey: ["ai-configs"] });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <DashboardShell>
        <DashboardHeader
          heading="AI Assistants"
          text="Configure and manage your AI assistants"
        >
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 size-4" />
            <span className="hidden sm:inline">New Assistant</span>
            <span className="sm:hidden">New</span>
          </Button>
        </DashboardHeader>

        <Separator />

        {/* Mobile View */}
        <div className="block lg:hidden">
          <div className="space-y-4">
            <div className="border-b pb-4">
              <ScrollArea className="h-[300px]">
                <AIConfigsList
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                />
              </ScrollArea>
            </div>
            <div>
              {selectedId ? (
                <AIConfigItem
                  id={selectedId}
                  onDelete={() => {
                    setSelectedId(null);
                    queryClient.invalidateQueries({ queryKey: ["ai-configs"] });
                  }}
                />
              ) : (
                <div className="flex h-[200px] items-center justify-center text-center">
                  <p className="px-4 text-sm text-muted-foreground">
                    Select an assistant above to view or edit
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:grid lg:h-[calc(100vh-220px)] lg:grid-cols-5 lg:gap-6">
          <div className="col-span-2 border-r">
            <ScrollArea className="h-full pr-6">
              <AIConfigsList
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </ScrollArea>
          </div>
          <div className="col-span-3 px-6">
            <ScrollArea className="h-full">
              {selectedId ? (
                <AIConfigItem
                  id={selectedId}
                  onDelete={() => {
                    setSelectedId(null);
                    queryClient.invalidateQueries({ queryKey: ["ai-configs"] });
                  }}
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    Select an assistant to view or edit
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <CreateConfigDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        />
      </DashboardShell>
    </QueryClientProvider>
  );
}

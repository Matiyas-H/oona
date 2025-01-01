
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface AssignConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  telyxNumber: string;
  currentConfigId?: string | null;
}

export function AssignConfigDialog({
  open,
  onOpenChange,
  telyxNumber,
  currentConfigId
}: AssignConfigDialogProps) {
  const [selectedConfig, setSelectedConfig] = useState<string | undefined>(currentConfigId || undefined);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const { data: configs } = useQuery({
    queryKey: ["ai-configs"],
    queryFn: async () => {
      const response = await fetch("/api/ai-configs");
      const data = await response.json();
      return data.configs;
    },
  });

  const handleAssign = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/user/ai-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telyxNumber,
          aiConfigId: selectedConfig || null,
        }),
      });

      if (!response.ok) throw new Error();

      toast({
        title: "Configuration assigned",
        description: "The AI configuration has been updated successfully.",
      });
      onOpenChange(false);
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign configuration.",
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
          <DialogTitle>Assign AI Configuration</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between"
              >
                {selectedConfig
                  ? configs?.find((config: any) => config.id === selectedConfig)?.name
                  : "Select configuration..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search configurations..." />
                <CommandEmpty>No configurations found.</CommandEmpty>
                <CommandGroup>
                  {configs?.map((config: any) => (
                    <CommandItem
                      key={config.id}
                      onSelect={() => setSelectedConfig(config.id)}
                    >
                      <Check
                        className={cn(
                          "mr-2 size-4",
                          selectedConfig === config.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {config.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          <div className="flex justify-end space-x-2">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={loading}>
              {loading ? "Assigning..." : "Assign Configuration"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
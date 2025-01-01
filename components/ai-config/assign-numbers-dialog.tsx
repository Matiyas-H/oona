"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AssignNumbersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  configId: string;
  currentNumbers: { telyxNumber: string }[];
}

export function AssignNumbersDialog({
  open,
  onOpenChange,
  configId,
  currentNumbers,
}: AssignNumbersDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>(
    currentNumbers.map(n => n.telyxNumber)
  );

  const { data: numbers } = useQuery({
    queryKey: ["user-numbers"],
    queryFn: async () => {
      const response = await fetch("/api/user/numbers");
      if (!response.ok) throw new Error("Failed to fetch numbers");
      return response.json();
    },
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/ai-configs/${configId}/numbers`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numbers: selectedNumbers }),
      });

      if (!response.ok) throw new Error();

      toast({
        title: "Numbers updated",
        description: "Phone numbers have been assigned successfully.",
      });
      
      // Invalidate relevant queries
      await queryClient.invalidateQueries({ queryKey: ["ai-config", configId] });
      await queryClient.invalidateQueries({ queryKey: ["ai-configs"] });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign numbers.",
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
          <DialogTitle>Assign Phone Numbers</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-2">
              {numbers?.map((number: { id: string, telyxNumber: string }) => (
                <div key={number.id} className="flex items-center space-x-2 rounded-lg border p-2">
                  <Checkbox
                    id={number.id}
                    checked={selectedNumbers.includes(number.telyxNumber)}
                    onCheckedChange={(checked) => {
                      setSelectedNumbers(prev =>
                        checked
                          ? [...prev, number.telyxNumber]
                          : prev.filter(n => n !== number.telyxNumber)
                      );
                    }}
                  />
                  <label htmlFor={number.id} className="grow cursor-pointer text-sm">
                    {number.telyxNumber}
                  </label>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex justify-end space-x-2 pt-2">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
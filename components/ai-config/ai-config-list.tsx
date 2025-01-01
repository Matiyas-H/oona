"use client";

import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";  // Add this import

import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { AIConfig } from "@/types/ai-config";

interface AIConfigsListProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function AIConfigsList({ selectedId, onSelect }: AIConfigsListProps) {
  const { data, isLoading } = useQuery<{ configs: AIConfig[] }>({
    queryKey: ["ai-configs"],
    queryFn: async () => {
      const response = await fetch("/api/ai-configs");
      return response.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;

  if (!data?.configs?.length) {
    return (
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="arrowUpRight" />
        <EmptyPlaceholder.Title>No configurations</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          Create your first AI configuration to get started.
        </EmptyPlaceholder.Description>
      </EmptyPlaceholder>
    );
  }

  return (
    <div className="space-y-2">
      {data?.configs?.map((config) => (
        <button
          key={config.id}
          onClick={() => onSelect(config.id)}
          className={cn(
            "flex w-full flex-col items-start gap-2 rounded-lg border p-4 text-left transition-colors hover:bg-accent",
            selectedId === config.id && "bg-muted"
          )}
        >
          <div className="flex w-full justify-between">
            <span className="font-semibold">{config.name}</span>
            <span className="text-xs text-muted-foreground">
              {config.userNumbers.length} number(s)
            </span>
          </div>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {config.greeting}
          </p>
        </button>
      ))}
    </div>
  );
}

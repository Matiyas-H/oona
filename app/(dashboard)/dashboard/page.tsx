"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { AIConfigItem } from "@/components/ai-config/ai-config-item";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

export default function DashboardPage() {
  const { data: configs, refetch } = useQuery({
    queryKey: ["ai-configs"],
    queryFn: async () => {
      const response = await fetch("/api/ai-configs");
      if (!response.ok) throw new Error("Failed to fetch configs");
      const data = await response.json();
      return data.configs;
    },
  });

  return (
    <DashboardShell>
      {/* ...existing code... */}
    </DashboardShell>
  );
}

"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function DataFetchingComponent({ initialData }) {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/proxy?limit=15");
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const newData = await res.json();
      setData(newData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={refreshData} disabled={isLoading}>
        {isLoading ? "Refreshing..." : "Refresh Data"}
      </Button>
      <Table>
        <TableCaption>A list of your recent calls.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Summary</TableHead>
            <TableHead>Transcript</TableHead>
            <TableHead>Recording URL</TableHead>
            <TableHead className="text-right">End Report</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.summary}</TableCell>
              <TableCell>{item.transcript}</TableCell>
              <TableCell>{item.recordingUrl}</TableCell>
              <TableCell className="text-right">{item.endReport}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

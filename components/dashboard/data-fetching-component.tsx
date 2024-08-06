"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      const res = await fetch("/api/calldata");
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

  const formatTranscript = (transcript) => {
    return transcript.split("\n").map((line, index) => {
      const [speaker, ...text] = line.split(":");
      return (
        <div
          key={index}
          className={`mb-2 ${speaker.trim().toLowerCase() === "ai" ? "text-blue-600" : "text-green-600"}`}
        >
          <strong>{speaker}:</strong> {text.join(":")}
        </div>
      );
    });
  };

  return (
    <div className="space-y-4">
      <Button onClick={refreshData} disabled={isLoading}>
        {isLoading ? "Refreshing..." : "Refresh Data"}
      </Button>
      {data.map((item, index) => (
        <Card key={index} className="mb-6">
          <CardHeader>
            <CardTitle>Call {index + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-lg font-semibold">Summary</h3>
                <p>{item.summary}</p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold">Transcript</h3>
                <div className="max-h-60 overflow-y-auto">
                  {formatTranscript(item.transcript)}
                </div>
              </div>
            </div>
            {item.recordingUrl && (
              <div className="mb-4">
                <h3 className="mb-2 text-lg font-semibold">Audio</h3>
                <audio controls src={item.recordingUrl}>
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
            {item.endReport && (
              <div>
                <h3 className="mb-2 text-lg font-semibold">End Report</h3>
                <p>{item.endReport}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

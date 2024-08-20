"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
};

interface CallData {
  startedAt: string;
  endedAt: string;
  summary: string;
  transcript: string;
  recordingUrl?: string;
  endReport?: string;
}

export function DataFetchingComponent({
  initialData,
}: {
  initialData: CallData[];
}) {
  const [data, setData] = useState<CallData[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/calldata");
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const newData: CallData[] = await res.json();
      setData(newData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTranscript = (transcript: string) => {
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

  const calculateTotalDuration = () => {
    if (!data || data.length === 0) return "N/A";

    const totalDuration = data.reduce((acc, item) => {
      if (item.startedAt && item.endedAt) {
        const start = new Date(item.startedAt).getTime();
        const end = new Date(item.endedAt).getTime();
        const duration = (end - start) / 1000; // Convert to seconds
        return acc + (isNaN(duration) ? 0 : duration);
      }
      return acc;
    }, 0);

    return formatDuration(Math.round(totalDuration));
  };

  const calculateAverageDuration = () => {
    if (!data || data.length === 0) return "N/A";

    const totalDuration = data.reduce((acc, item) => {
      if (item.startedAt && item.endedAt) {
        const start = new Date(item.startedAt).getTime();
        const end = new Date(item.endedAt).getTime();
        const duration = (end - start) / 1000; // Convert to seconds
        return acc + (isNaN(duration) ? 0 : duration);
      }
      return acc;
    }, 0);

    const validCallsCount = data.filter(
      (item) => item.startedAt && item.endedAt,
    ).length;

    if (validCallsCount === 0) return "N/A";

    const averageDuration = totalDuration / validCallsCount;
    return formatDuration(Math.round(averageDuration));
  };

  return (
    <div className="space-y-4">
      <Button onClick={refreshData} disabled={isLoading}>
        {isLoading ? "Refreshing..." : "Refresh Data"}
      </Button>
      <div className="flex justify-between">
        <Card className="mr-4 w-full md:w-1/2">
          <CardHeader>
            <CardTitle>Average Call Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {calculateAverageDuration()}
            </div>
          </CardContent>
        </Card>
        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle>Total Call Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateTotalDuration()}</div>
          </CardContent>
        </Card>
      </div>
      {data.map((item, index) => (
        <Card key={index} className="mb-6">
          <CardHeader>
            <CardTitle>Call {index + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-lg font-semibold">Call Details</h3>
                <p>
                  <strong>Start Time:</strong>{" "}
                  {new Date(item.startedAt).toLocaleString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  })}
                </p>
                <p>
                  <strong>End Time:</strong>{" "}
                  {new Date(item.endedAt).toLocaleString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  })}
                </p>
                <p>
                  <strong>Duration:</strong>{" "}
                  {formatDuration(
                    Math.round(
                      (new Date(item.endedAt).getTime() -
                        new Date(item.startedAt).getTime()) /
                        1000,
                    ),
                  )}
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold">Summary</h3>
                <p>{item.summary}</p>
              </div>
            </div>
            <hr className="my-4" />
            <div>
              <h3 className="mb-2 text-lg font-semibold">Transcript</h3>
              <div className="max-h-60 overflow-y-auto">
                {formatTranscript(item.transcript)}
              </div>
            </div>
            {item.recordingUrl && (
              <div className="mt-4">
                <h3 className="mb-2 text-lg font-semibold">Audio</h3>
                <audio controls src={item.recordingUrl}>
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
            {item.endReport && (
              <div className="mt-4">
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

// components/dashboard/data-fetching-component.tsx

// components/dashboard/data-fetching-component.tsx
// components/dashboard/data-fetching-component.tsx
// "use client";

// import { useState } from "react";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";

// interface AnalyticsItem {
//   date: string;
//   avgDuration: string;
//   sumDuration: string;
//   endedReason: string;
// }

// interface CallDataItem {
//   summary: string;
//   transcript: string;
//   recordingUrl?: string;
// }

// interface DataType {
//   analyticsData: AnalyticsItem[];
//   callData: CallDataItem[];
// }

// export function DataFetchingComponent({
//   initialData,
// }: {
//   initialData: DataType;
// }) {
//   const [data, setData] = useState<DataType>(initialData);
//   const [isLoading, setIsLoading] = useState(false);

//   const refreshData = async () => {
//     setIsLoading(true);
//     try {
//       const res = await fetch("/api/calldata");
//       if (!res.ok) {
//         throw new Error("Failed to fetch data");
//       }
//       const newData: DataType = await res.json();
//       setData(newData);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const formatDuration = (seconds: number): string => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = Math.round(seconds % 60);
//     if (minutes === 0) {
//       return `${remainingSeconds}s`;
//     }
//     return `${minutes}m ${remainingSeconds}s`;
//   };

//   const calculateTotalDuration = (): number => {
//     return data.analyticsData.reduce((total, item) => {
//       const [minutes, seconds] = item.sumDuration.split("m");
//       return total + parseFloat(minutes) * 60 + parseFloat(seconds);
//     }, 0);
//   };

//   const calculateAverageDuration = (): number => {
//     const total = calculateTotalDuration();
//     return total / data.analyticsData.length;
//   };

//   const getTotalCalls = (): number => {
//     return data.callData.length;
//   };

//   const getEndedReasons = () => {
//     const reasons = data.analyticsData.reduce<Record<string, number>>(
//       (acc, item) => {
//         acc[item.endedReason] = (acc[item.endedReason] || 0) + 1;
//         return acc;
//       },
//       {},
//     );
//     const total = Object.values(reasons).reduce((sum, count) => sum + count, 0);
//     return Object.entries(reasons).map(([reason, count]) => ({
//       reason,
//       count,
//       percentage: (count / total) * 100,
//     }));
//   };

//   return (
//     <div className="space-y-4">
//       <Button onClick={refreshData} disabled={isLoading}>
//         {isLoading ? "Refreshing..." : "Refresh Data"}
//       </Button>

//       <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//         <Card>
//           <CardHeader>
//             <CardTitle>Total Call Duration</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {formatDuration(calculateTotalDuration())}
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Total Number of Calls</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{getTotalCalls()}</div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Average Call Duration</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {formatDuration(calculateAverageDuration())}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Call Ended Reasons</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-2">
//             {getEndedReasons().map(({ reason, count, percentage }) => (
//               <div key={reason} className="space-y-1">
//                 <div className="flex justify-between text-sm">
//                   <span>{reason}</span>
//                   <span>
//                     {count} ({percentage.toFixed(1)}%)
//                   </span>
//                 </div>
//                 <Progress value={percentage} className="h-2" />
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Call Data Section */}
//       {data.callData.map((item, index) => (
//         <Card key={index} className="mb-6">
//           <CardHeader>
//             <CardTitle>Call {index + 1}</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
//               <div>
//                 <h3 className="mb-2 text-lg font-semibold">Summary</h3>
//                 <p>{item.summary}</p>
//               </div>
//               <div>
//                 <h3 className="mb-2 text-lg font-semibold">Transcript</h3>
//                 <div className="max-h-60 overflow-y-auto">
//                   {item.transcript.split("\n").map((line, lineIndex) => {
//                     const [speaker, ...text] = line.split(":");
//                     return (
//                       <div
//                         key={lineIndex}
//                         className={`mb-2 ${speaker.trim().toLowerCase() === "ai" ? "text-blue-600" : "text-green-600"}`}
//                       >
//                         <strong>{speaker}:</strong> {text.join(":")}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>
//             {item.recordingUrl && (
//               <div className="mb-4">
//                 <h3 className="mb-2 text-lg font-semibold">Audio</h3>
//                 <audio controls src={item.recordingUrl}>
//                   Your browser does not support the audio element.
//                 </audio>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// }

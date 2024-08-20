"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

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
  const [averageChartOptions, setAverageChartOptions] = useState<any>(null);
  const [totalChartOptions, setTotalChartOptions] = useState<any>(null);

  useEffect(() => {
    updateCharts();
  }, [data]);

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

  const updateCharts = () => {
    // Average Duration Pie Chart
    const avgDuration = calculateAverageDuration();
    const avgMinutes = parseFloat(avgDuration.split("m")[0]);
    const avgSeconds = parseFloat(avgDuration.split("m")[1].split("s")[0]);
    const totalSeconds = avgMinutes * 60 + avgSeconds;

    setAverageChartOptions({
      series: [totalSeconds],
      chart: {
        height: 250,
        type: "radialBar",
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: "70%",
          },
        },
      },
      labels: ["Average Duration"],
      colors: ["#FF6384"],
    });

    // Total Duration Bar Chart
    const callDurations = data.map((item) => {
      const start = new Date(item.startedAt).getTime();
      const end = new Date(item.endedAt).getTime();
      return Math.round((end - start) / 1000); // Keep as seconds
    });

    setTotalChartOptions({
      series: [
        {
          name: "Duration",
          data: callDurations,
        },
      ],
      chart: {
        height: 250,
        type: "bar",
      },
      plotOptions: {
        bar: {
          borderRadius: 5,
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return formatDuration(val);
        },
        offsetY: -20,
        style: {
          fontSize: "10px",
          colors: ["#304758"],
        },
      },
      xaxis: {
        categories: data.map((_, index) => `Call ${index + 1}`),
        position: "top",
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          fill: {
            type: "gradient",
            gradient: {
              colorFrom: "#D8E3F0",
              colorTo: "#BED1E6",
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            },
          },
        },
        tooltip: {
          enabled: true,
        },
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
        },
      },
      title: {
        text: "Call Durations",
        floating: true,
        offsetY: 250,
        align: "center",
        style: {
          color: "#444",
          fontSize: "14px",
        },
      },
      colors: ["#36D7B7"],
    });
  };

  return (
    <div className="space-y-4">
      <Button onClick={refreshData} disabled={isLoading}>
        {isLoading ? "Refreshing..." : "Refresh Data"}
      </Button>
      <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle>Average Call Duration</CardTitle>
          </CardHeader>
          <CardContent className="flex h-[300px] flex-col justify-between">
            <div className="text-2xl font-bold">
              {calculateAverageDuration()}
            </div>
            {averageChartOptions && (
              <div className="h-[250px] w-full">
                <Chart
                  options={averageChartOptions}
                  series={averageChartOptions.series}
                  type="donut"
                  height={250}
                  width="100%"
                />
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle>Total Call Duration</CardTitle>
          </CardHeader>
          <CardContent className="flex h-[300px] flex-col justify-between">
            <div className="text-2xl font-bold">{calculateTotalDuration()}</div>
            {totalChartOptions && (
              <div className="h-[250px] w-full">
                <Chart
                  options={totalChartOptions}
                  series={totalChartOptions.series}
                  type="bar"
                  height={250}
                  width="100%"
                />
              </div>
            )}
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

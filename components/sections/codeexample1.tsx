"use client";

import Link from "next/link";
import { ArrowUpRight, FileDown } from "lucide-react";
import { useState } from "react";

import type { BundledLanguage } from "@/components/kibo-ui/code-block/index";
import {
  CodeBlock,
  CodeBlockBody,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFilename,
  CodeBlockFiles,
  CodeBlockHeader,
  CodeBlockItem,
} from "@/components/kibo-ui/code-block/index";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Tag from "@/components/Tag";

const code = [
  {
    language: "javascript",
    filename: "create-webrtc-call.js",
    code: `import fetch from "node-fetch";

const API_KEY = process.env.OMNIA_API_KEY ?? "";
const AGENT_ID = process.env.OMNIA_AGENT_ID ?? "";
const BASE_URL = "https://api.omnia-voice.com/api/v1";

async function createWebrtcCall() {
  const payload = {
    agentId: AGENT_ID,
    connectionType: "webrtc",
  };

  const res = await fetch(\`\${BASE_URL}/calls/create\`, {
    method: "POST",
    headers: {
      "X-API-Key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(\`Create call failed: \${res.status} - \${detail}\`);
  }

  const session = await res.json();
  console.log("Call session:", session.id);
  console.log("Connect with WebRTC using:", session.websocketUrl);
}

createWebrtcCall().catch((err) => {
  console.error("Failed to create call:", err);
});`,
  },
  {
    language: "python",
    filename: "create_outbound_call.py",
    code: `import os
import requests

API_KEY = os.getenv("OMNIA_API_KEY")
AGENT_ID = os.getenv("OMNIA_AGENT_ID")
FROM_NUMBER_ID = os.getenv("OMNIA_FROM_NUMBER_ID")

payload = {
    "agentId": AGENT_ID,
    "phoneNumber": "+15551234567",
    "fromNumberId": FROM_NUMBER_ID,
}

response = requests.post(
    "https://api.omnia-voice.com/api/v1/calls/outbound",
    headers={
        "X-API-Key": API_KEY,
        "Content-Type": "application/json",
    },
    json=payload,
    timeout=10,
)

response.raise_for_status()
data = response.json()
print("Outbound call SID:", data["id"])
print("Session WebSocket:", data["websocketUrl"])`,
  },
  {
    language: "go",
    filename: "create_tool_and_assign.go",
    code: `package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "net/http"
    "os"
)

type httpTool struct {
    Type            string                 \`json:"type"\`
    Name            string                 \`json:"name"\`
    ModelToolName   string                 \`json:"modelToolName"\`
    Description     string                 \`json:"description"\`
    HTTPMethod      string                 \`json:"httpMethod"\`
    BaseURLPattern  string                 \`json:"baseUrlPattern"\`
    AutomaticParams map[string]interface{} \`json:"automaticParameters"\`
    DynamicParams   map[string]interface{} \`json:"dynamicParameters"\`
}

func main() {
    apiKey := os.Getenv("OMNIA_API_KEY")
    agentID := os.Getenv("OMNIA_AGENT_ID")

    // 1. Create an HTTP tool the agent can invoke.
    toolPayload := httpTool{
        Type:           "http",
        Name:           "Create CRM Task",
        ModelToolName:  "create_crm_task",
        Description:    "Create a follow-up task in the CRM",
        HTTPMethod:     "POST",
        BaseURLPattern: "https://example.com/api/tasks",
        AutomaticParams: map[string]interface{}{
            "apiKey": map[string]interface{}{
                "location":   "header",
                "knownValue": "{{CRM_API_KEY}}",
            },
        },
        DynamicParams: map[string]interface{}{
            "title": map[string]interface{}{
                "location": "body",
                "schema": map[string]string{
                    "type":        "string",
                    "description": "Task title generated from conversation",
                },
                "required": true,
            },
            "notes": map[string]interface{}{
                "location": "body",
                "schema": map[string]string{
                    "type":        "string",
                    "description": "Additional context",
                },
                "required": false,
            },
        },
    }

    toolBody, err := json.Marshal(toolPayload)
    if err != nil {
        panic(err)
    }

    createToolReq, err := http.NewRequest(
        "POST",
        "https://api.omnia-voice.com/api/v1/agent-tools",
        bytes.NewBuffer(toolBody),
    )
    if err != nil {
        panic(err)
    }
    createToolReq.Header.Set("X-API-Key", apiKey)
    createToolReq.Header.Set("Content-Type", "application/json")

    createResp, err := http.DefaultClient.Do(createToolReq)
    if err != nil {
        panic(err)
    }
    defer createResp.Body.Close()

    if createResp.StatusCode >= 400 {
        panic(fmt.Sprintf("create tool failed with status %s", createResp.Status))
    }

    var created struct {
        ID string \`json:"id"\`
    }
    if err := json.NewDecoder(createResp.Body).Decode(&created); err != nil {
        panic(err)
    }

    // 2. Assign the tool to the agent.
    assignPayload := map[string][]string{
        "toolIds": {created.ID},
    }
    assignBody, err := json.Marshal(assignPayload)
    if err != nil {
        panic(err)
    }

    assignReq, err := http.NewRequest(
        "POST",
        fmt.Sprintf("https://api.omnia-voice.com/api/v1/agents/%s/tools", agentID),
        bytes.NewBuffer(assignBody),
    )
    if err != nil {
        panic(err)
    }
    assignReq.Header.Set("X-API-Key", apiKey)
    assignReq.Header.Set("Content-Type", "application/json")

    assignResp, err := http.DefaultClient.Do(assignReq)
    if err != nil {
        panic(err)
    }
    defer assignResp.Body.Close()

    if assignResp.StatusCode >= 400 {
        panic(fmt.Sprintf("assign tool failed with status %s", assignResp.Status))
    }

    fmt.Println("Tool created and assigned to agent:", created.ID)
}`,
  },
  {
    language: "ruby",
    filename: "get-call-details.rb",
    code: `require "net/http"
require "json"

API_KEY = ENV.fetch("OMNIA_API_KEY")
CALL_ID = ENV.fetch("OMNIA_CALL_ID")
ENDPOINT = URI("https://api.omnia-voice.com/api/v1/calls/#{CALL_ID}")

request = Net::HTTP::Get.new(ENDPOINT)
request["X-API-Key"] = API_KEY

http = Net::HTTP.new(ENDPOINT.host, ENDPOINT.port)
http.use_ssl = true

response = http.request(request)
abort("Error: #{response.code}") unless response.code.to_i == 200

call = JSON.parse(response.body)
puts "Call duration: #{call['duration']} seconds"
puts "Status: #{call['status']}"
puts "Summary: #{call['summary'] || 'n/a'}"`,
  },
];

const Codeexample1 = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");

  return (
    <section className="py-32">
      <div className="container">
        <div className="grid place-items-center gap-10 lg:grid-cols-2 lg:gap-0">
          <div className="flex flex-col gap-6 lg:pr-20">
            <Tag className="self-start">Built for Developers</Tag>
            <span className="text-lg text-muted-foreground">
              REST + WebSocket API · identical on hosted and self-managed Omnia
            </span>
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              Control agents, calls, and tools from your codebase
            </h2>
            <p className="text-muted-foreground md:text-lg">
              Manage agents, launch calls, and wire up tools off the same API surface—identical whether you ship on Omnia Cloud or run the stack yourself.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="w-fit" asChild>
                <a
                  href="https://dashboard.omnia-voice.com/docs"
                  className="flex items-center gap-2"
                >
                  Read the docs
                  <ArrowUpRight className="size-4" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-fit"
                asChild
              >
                <Link
                  href="https://dashboard.omnia-voice.com/openapi.yaml"
                  className="flex items-center gap-2"
                >
                  Download OpenAPI
                  <FileDown className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex w-full flex-col gap-1 overflow-hidden">
            <Tabs defaultValue="javascript" onValueChange={setSelectedLanguage}>
              <TabsList className="h-10 w-full">
                <TabsTrigger value="javascript">Javascript</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="go">Go</TabsTrigger>
                <TabsTrigger value="ruby">Ruby</TabsTrigger>
              </TabsList>
            </Tabs>
            <CodeBlock data={code} value={selectedLanguage} className="w-full">
              <CodeBlockHeader>
                <CodeBlockFiles>
                  {(item) => (
                    <CodeBlockFilename
                      key={item.language}
                      value={item.language}
                    >
                      {item.filename}
                    </CodeBlockFilename>
                  )}
                </CodeBlockFiles>
                <CodeBlockCopyButton
                  onCopy={() => console.log("Copied code to clipboard")}
                  onError={() =>
                    console.error("Failed to copy code to clipboard")
                  }
                />
              </CodeBlockHeader>
              <ScrollArea className="w-full">
                <CodeBlockBody>
                  {(item) => (
                    <CodeBlockItem
                      key={item.language}
                      value={item.language}
                      className="max-h-96 w-full"
                    >
                      <CodeBlockContent
                        language={item.language as BundledLanguage}
                      >
                        {item.code}
                      </CodeBlockContent>
                    </CodeBlockItem>
                  )}
                </CodeBlockBody>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CodeBlock>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Codeexample1 };

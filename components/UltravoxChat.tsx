"use client";

// components/VoiceChat.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Mic, MicOff, PhoneCall, PhoneOff } from "lucide-react";
import {
  Role,
  Transcript,
  UltravoxSession,
  UltravoxSessionStatus,
} from "ultravox-client";

import { endCall, startCall, toggleMute } from "@/lib/callFunctions";

interface VoiceChatProps {
  config: {
    systemPrompt: string;
    greeting: string;
    context: string;
    questions?: string;
    model?: string;
    languageHint?: string;
    voice?: string;
    temperature?: number;
  };
  onClose?: () => void;
}

export default function VoiceChat({ config, onClose }: VoiceChatProps) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [agentStatus, setAgentStatus] = useState("off");
  const [callTranscript, setCallTranscript] = useState<Transcript[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const transcriptContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop =
        transcriptContainerRef.current.scrollHeight;
    }
  }, [callTranscript]);

  const handleStatusChange = useCallback(
    (status: UltravoxSessionStatus | string | undefined) => {
      if (status) {
        setAgentStatus(status);
      } else {
        setAgentStatus("off");
      }
    },
    [],
  );

  const handleTranscriptChange = useCallback(
    (transcripts: Transcript[] | undefined) => {
      if (transcripts) {
        setCallTranscript([...transcripts]);
      }
    },
    [],
  );

  const handleStartCallButtonClick = async () => {
    try {
      const callConfig = {
        systemPrompt: config.systemPrompt,
        model: config.model || "fixie-ai/ultravox-70B",
        languageHint: config.languageHint || "en",
        voice: config.voice || "terrence",
        temperature: config.temperature || 0.5,
        firstSpeaker: "FIRST_SPEAKER_AGENT",
      };

      await startCall(
        {
          onStatusChange: handleStatusChange,
          onTranscriptChange: handleTranscriptChange,
        },
        callConfig,
      );

      setIsCallActive(true);
    } catch (error) {
      console.error("Failed to start call:", error);
      handleStatusChange(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  const handleEndCallButtonClick = async () => {
    try {
      await endCall();
      setIsCallActive(false);
      setIsMuted(false);
    } catch (error) {
      console.error("Failed to end call:", error);
    }
  };

  const handleToggleMic = () => {
    toggleMute(Role.USER);
    setIsMuted(!isMuted);
  };

  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-800">
      <div className="bg-gray-900 p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-400">Status: {agentStatus}</div>
        </div>

        <div
          ref={transcriptContainerRef}
          className="mb-4 h-[400px] overflow-y-auto rounded-lg bg-gray-950 p-4"
        >
          {callTranscript.map((transcript, index) => (
            <div
              key={index}
              className={`mb-4 ${transcript.speaker === "agent" ? "text-blue-400" : "text-green-400"}`}
            >
              <div className="mb-1 text-xs text-gray-500">
                {transcript.speaker === "agent" ? "Assistant" : "You"}
              </div>
              <div className="text-white">{transcript.text}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4">
          {!isCallActive ? (
            <button
              onClick={handleStartCallButtonClick}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-white transition-colors hover:bg-green-700"
            >
              <PhoneCall size={20} />
              Start Call
            </button>
          ) : (
            <>
              <button
                onClick={handleToggleMic}
                className={`flex items-center gap-2 ${
                  isMuted
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } rounded-lg px-6 py-3 text-white transition-colors`}
              >
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                {isMuted ? "Unmute" : "Mute"}
              </button>
              <button
                onClick={handleEndCallButtonClick}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-white transition-colors hover:bg-red-700"
              >
                <PhoneOff size={20} />
                End Call
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

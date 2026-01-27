"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Upload, Phone, PhoneOff, Headphones, X, Loader2 } from "lucide-react";
// Note: MicOff kept for STT mode, PhoneOff for agent end button
import { OmniaSession } from "@omnia-voice/sdk";

type Tab = "transcribe" | "agent";
type TranscribeMode = "live" | "upload";
type AgentStatus = "disconnected" | "connecting" | "listening" | "thinking" | "speaking";

// Format retry time in a human-friendly way
const formatRetryTime = (seconds: number): string => {
  if (seconds < 60) {
    return "less than a minute";
  } else if (seconds < 3600) {
    const minutes = Math.ceil(seconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else {
    const hours = Math.ceil(seconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
};

const Playground = () => {
  const [activeTab, setActiveTab] = useState<Tab>("transcribe");
  const [transcribeMode, setTranscribeMode] = useState<TranscribeMode>("live");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Voice agent state
  const [agentStatus, setAgentStatus] = useState<AgentStatus>("disconnected");
  const [isStartingCall, setIsStartingCall] = useState(false);
  const sessionRef = useRef<OmniaSession | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Omnia session - fetch API key from server
  const initVoiceSession = async () => {
    try {
      console.log("[Voice Session] Fetching API key from server...");
      // Fetch API key from server-side endpoint
      const response = await fetch('/api/voice/session');
      const data = await response.json();
      console.log("[Voice Session] Server response status:", response.status);

      if (!response.ok) {
        console.log("[Voice Session] Server error:", data);
        if (response.status === 429) {
          const retryTime = formatRetryTime(data.retryAfter || 60);
          setError(`Daily limit reached. Please try again in ${retryTime}.`);
        }
        // Don't show other errors to user
        return null;
      }

      console.log("[Voice Session] Got API key, creating OmniaSession with baseUrl:", data.baseUrl);
      const session = new OmniaSession({
        apiKey: data.apiKey,
        baseUrl: data.baseUrl,
      });

      session.addEventListener("status", () => {
        console.log("[Voice Session] Status changed:", session.status);
        setAgentStatus(session.status as AgentStatus);
      });

      // Transcripts listener removed - not showing transcripts in UI

      console.log("[Voice Session] Session created successfully");
      return session;
    } catch (err) {
      // Silent fail - don't show raw errors
      console.error('[Voice Session] Failed to initialize:', err);
      return null;
    }
  };

  useEffect(() => {
    initVoiceSession().then((session) => {
      if (session) {
        sessionRef.current = session;
      }
    });

    return () => {
      if (sessionRef.current && sessionRef.current.status !== "disconnected") {
        sessionRef.current.leaveCall();
      }
    };
  }, []);

  // Start voice agent call
  const startAgentCall = async () => {
    if (isStartingCall) return; // Prevent double clicks

    setIsStartingCall(true);
    setError(null);
    console.log("[Voice Agent] Starting call...");
    console.log("[Voice Agent] Current session:", sessionRef.current);
    console.log("[Voice Agent] Current status:", agentStatus);

    // Try to initialize session if not available
    if (!sessionRef.current) {
      console.log("[Voice Agent] No session, initializing...");
      const session = await initVoiceSession();
      if (!session) {
        console.log("[Voice Agent] Failed to initialize session");
        setIsStartingCall(false);
        return; // Error already set by initVoiceSession
      }
      sessionRef.current = session;
      console.log("[Voice Agent] Session initialized:", session);
    }

    try {
      // Use the Omnia agent ID (not voice ID)
      const agentId = "cmfealzvc00028e6g8mmumwh5";
      console.log("[Voice Agent] Joining call with agentId:", agentId);
      await sessionRef.current.joinCall({
        agentId,
      });
      console.log("[Voice Agent] joinCall completed successfully");
    } catch (err) {
      // Silent fail - don't show raw errors
      console.error("[Voice Agent] joinCall error:", err);
    } finally {
      setIsStartingCall(false);
    }
  };

  // End voice agent call
  const endAgentCall = async () => {
    if (!sessionRef.current) return;
    await sessionRef.current.leaveCall();
  };

  // Stop recording helper (defined first to avoid circular dependency)
  const cleanupRecording = useCallback(() => {
    setIsRecording(false);

    // Stop audio processing
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Close WebSocket
    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "end" }));
      }
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  // Start live recording
  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setFinalTranscript("");
      setInterimTranscript("");
      setIsConnecting(true);

      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      streamRef.current = stream;

      // Get WebSocket URL from server
      const urlResponse = await fetch('/api/stt/stream-url');
      const urlData = await urlResponse.json();

      if (!urlResponse.ok) {
        if (urlResponse.status === 429) {
          const retryTime = formatRetryTime(urlData.retryAfter || 60);
          throw new Error(`Daily limit reached. Please try again in ${retryTime}.`);
        }
        // Silent fail for other errors
        throw new Error('SILENT');
      }
      const { wsUrl } = urlData;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("Connected to STT service");
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "ready") {
          // Start audio processing once ready
          startAudioProcessing(stream);
          setIsConnecting(false);
          setIsRecording(true);
        } else if (data.type === "transcript") {
          if (data.isFinal) {
            // Final result - append to accumulated transcript
            setFinalTranscript((prev) => {
              const separator = prev ? " " : "";
              return prev + separator + data.transcript;
            });
            setInterimTranscript("");
          } else {
            // Interim result - show in progress (dimmer)
            setInterimTranscript(data.transcript);
          }
        } else if (data.type === "error") {
          // Don't show raw errors to user - just stop gracefully
          console.error("STT error:", data.error);
          setIsConnecting(false);
          cleanupRecording();
        }
      };

      ws.onerror = () => {
        // Silent fail - don't show connection errors
        console.error("WebSocket connection error");
        setIsConnecting(false);
        cleanupRecording();
      };

      ws.onclose = (event) => {
        // Only log, don't show errors for normal closes or short sessions
        if (event.code !== 1000) {
          console.log("Disconnected from STT service:", event.code);
        }
      };
    } catch (err) {
      setIsConnecting(false);
      if (err instanceof Error && err.name === "NotAllowedError") {
        setError("Microphone access denied. Please allow microphone access.");
      } else if (err instanceof Error && err.message.startsWith("Daily limit")) {
        setError(err.message);
      }
      // Silent fail for other errors - don't show raw errors
      // Stop the stream if we got mic access but failed later
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }
  }, [cleanupRecording]);

  // Start audio processing
  const startAudioProcessing = (stream: MediaStream) => {
    const audioContext = new AudioContext({ sampleRate: 16000 });
    audioContextRef.current = audioContext;

    const source = audioContext.createMediaStreamSource(stream);
    const processor = audioContext.createScriptProcessor(4096, 1, 1);
    processorRef.current = processor;

    processor.onaudioprocess = (event) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        const inputData = event.inputBuffer.getChannelData(0);

        // Convert Float32 to Int16 PCM
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }

        wsRef.current.send(pcmData.buffer);
      }
    };

    source.connect(processor);
    processor.connect(audioContext.destination);
  };

  // Alias for clarity in UI
  const stopRecording = cleanupRecording;

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    try {
      setError(null);
      setFinalTranscript("");
      setInterimTranscript("");
      setIsProcessing(true);

      const contentTypes: Record<string, string> = {
        "audio/wav": "audio/wav",
        "audio/wave": "audio/wav",
        "audio/x-wav": "audio/wav",
        "audio/mp3": "audio/mp3",
        "audio/mpeg": "audio/mp3",
        "audio/flac": "audio/flac",
        "audio/ogg": "audio/ogg",
        "audio/webm": "audio/webm",
      };

      const contentType = contentTypes[file.type] || "audio/raw";

      // Use server-side proxy for transcription
      const response = await fetch("/api/stt/transcribe", {
        method: "POST",
        headers: {
          "Content-Type": contentType,
        },
        body: file,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          const retryTime = formatRetryTime(data.retryAfter || 60);
          setError(`Daily limit reached. Please try again in ${retryTime}.`);
        }
        // Silent fail for other errors
        return;
      }

      setFinalTranscript(data.transcript);
    } catch (err) {
      // Silent fail - don't show raw errors
      console.error("Transcription error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const clearTranscript = () => {
    setFinalTranscript("");
    setInterimTranscript("");
    setError(null);
  };

  return (
    <section className="bg-[#1a1a1a] py-24 md:py-32">
      <div className="container max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center md:mb-16">
          <span className="text-xs font-medium tracking-wide text-white/40">
            PLAYGROUND
          </span>
          <h2 className="mt-4 font-heading text-3xl text-white md:text-4xl lg:text-5xl">
            Try it yourself
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/50">
            Test our transcription accuracy or talk to a voice agent.
          </p>
        </div>

        {/* Tabs */}
        <div className="mx-auto mb-8 flex max-w-md overflow-hidden border border-white/10">
          <button
            onClick={() => setActiveTab("transcribe")}
            className={`flex-1 px-6 py-3 text-sm font-medium tracking-wide transition-colors ${
              activeTab === "transcribe"
                ? "bg-white text-[#1a1a1a]"
                : "text-white/60 hover:text-white"
            }`}
          >
            TRANSCRIBE
          </button>
          <button
            onClick={() => setActiveTab("agent")}
            className={`flex-1 px-6 py-3 text-sm font-medium tracking-wide transition-colors ${
              activeTab === "agent"
                ? "bg-white text-[#1a1a1a]"
                : "text-white/60 hover:text-white"
            }`}
          >
            VOICE AGENT
          </button>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-3xl">
          {activeTab === "transcribe" ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border border-white/10 bg-white/[0.02] p-6 md:p-8"
            >
              {/* Mode toggle */}
              <div className="mb-6 flex gap-2">
                <button
                  onClick={() => {
                    setTranscribeMode("live");
                    clearTranscript();
                  }}
                  className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                    transcribeMode === "live"
                      ? "bg-[#2D5A27] text-white"
                      : "border border-white/20 text-white/60 hover:text-white"
                  }`}
                >
                  <Mic className="size-4" />
                  Live
                </button>
                <button
                  onClick={() => {
                    setTranscribeMode("upload");
                    clearTranscript();
                    if (isRecording) stopRecording();
                  }}
                  className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                    transcribeMode === "upload"
                      ? "bg-[#2D5A27] text-white"
                      : "border border-white/20 text-white/60 hover:text-white"
                  }`}
                >
                  <Upload className="size-4" />
                  Upload
                </button>
              </div>

              {/* Live mode */}
              {transcribeMode === "live" && (
                <div className="flex flex-col items-center">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isConnecting}
                    className={`mb-6 flex size-20 items-center justify-center rounded-full transition-all ${
                      isConnecting
                        ? "bg-white/20 text-white/60"
                        : isRecording
                          ? "animate-pulse bg-red-500 text-white"
                          : "bg-[#2D5A27] text-white hover:bg-[#2D5A27]/80"
                    }`}
                  >
                    {isConnecting ? (
                      <Loader2 className="size-8 animate-spin" />
                    ) : isRecording ? (
                      <MicOff className="size-8" />
                    ) : (
                      <Mic className="size-8" />
                    )}
                  </button>
                  <p className="mb-6 text-sm text-white/50">
                    {isConnecting
                      ? "Connecting..."
                      : isRecording
                        ? "Listening... Click to stop"
                        : "Click to start recording"}
                  </p>
                </div>
              )}

              {/* Upload mode */}
              {transcribeMode === "upload" && (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="mb-6 flex flex-col items-center justify-center border border-dashed border-white/20 bg-white/[0.02] p-8 transition-colors hover:border-white/40"
                >
                  <Upload className="mb-4 size-8 text-white/40" />
                  <p className="mb-2 text-sm text-white/60">
                    Drag & drop an audio file, or
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm text-[#2D5A27] hover:underline"
                  >
                    browse files
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <p className="mt-4 text-xs text-white/30">
                    MP3, WAV, FLAC, OGG, WebM
                  </p>
                </div>
              )}

              {/* Processing indicator */}
              {isProcessing && (
                <div className="mb-6 flex items-center justify-center gap-2 text-white/60">
                  <Loader2 className="size-4 animate-spin" />
                  <span className="text-sm">Transcribing...</span>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mb-6 border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Transcript output */}
              <div className="min-h-[120px] border border-white/10 bg-[#0d0d0d] p-4">
                {finalTranscript || interimTranscript ? (
                  <div className="relative">
                    <button
                      onClick={clearTranscript}
                      className="absolute right-0 top-0 p-1 text-white/30 hover:text-white/60"
                    >
                      <X className="size-4" />
                    </button>
                    <p className="pr-6 font-mono text-sm leading-relaxed text-white/80">
                      {finalTranscript}
                      {finalTranscript && interimTranscript && " "}
                      <span className="text-white/50">{interimTranscript}</span>
                    </p>
                  </div>
                ) : (
                  <p className="font-mono text-sm text-white/30">
                    {isRecording
                      ? "Speak now..."
                      : "Your transcript will appear here..."}
                  </p>
                )}
              </div>

              {/* Features */}
              <div className="mt-6 flex flex-wrap gap-4 text-xs text-white/40">
                <span>50+ languages</span>
                <span className="text-white/20">·</span>
                <span>Auto-detect</span>
                <span className="text-white/20">·</span>
                <span>Streaming & batch</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border border-white/10 bg-white/[0.02] p-6 md:p-8"
            >
              <div className="flex flex-col items-center text-center">
                {/* Visual indicator */}
                <div className={`relative mb-6 flex size-24 items-center justify-center rounded-full transition-all duration-300 ${
                  agentStatus === "disconnected"
                    ? "border border-[#2D5A27]/30 bg-[#2D5A27]/10"
                    : agentStatus === "speaking"
                      ? "bg-[#2D5A27]/20"
                      : agentStatus === "connecting"
                        ? "bg-white/5"
                        : "bg-[#2D5A27]/10"
                }`}>
                  {/* Animated rings when active */}
                  {agentStatus !== "disconnected" && (
                    <>
                      <div className={`absolute inset-0 rounded-full border-2 ${
                        agentStatus === "speaking" ? "animate-ping border-[#2D5A27]/40" : "border-transparent"
                      }`} />
                      <div className={`absolute inset-2 rounded-full border ${
                        agentStatus === "speaking" ? "animate-pulse border-[#2D5A27]/60" :
                        agentStatus === "listening" ? "border-[#2D5A27]/40" :
                        "border-white/10"
                      }`} />
                    </>
                  )}
                  <Headphones className={`size-10 transition-colors ${
                    agentStatus === "disconnected" ? "text-[#2D5A27]" :
                    agentStatus === "speaking" ? "text-[#2D5A27]" :
                    agentStatus === "connecting" ? "text-white/40" :
                    "text-[#2D5A27]/80"
                  }`} />
                </div>

                {/* Status text */}
                <p className="mb-6 text-sm text-white/50">
                  {agentStatus === "disconnected" && "Talk to our AI voice agent"}
                  {agentStatus === "connecting" && "Connecting..."}
                  {agentStatus === "listening" && "Listening..."}
                  {agentStatus === "thinking" && "Thinking..."}
                  {agentStatus === "speaking" && "Speaking..."}
                </p>

                {/* Single button - Start or End */}
                {agentStatus === "disconnected" ? (
                  <button
                    onClick={startAgentCall}
                    disabled={isStartingCall}
                    className="inline-flex h-12 items-center justify-center gap-2 bg-[#2D5A27] px-8 text-sm font-medium tracking-wide text-white transition-all hover:bg-[#2D5A27]/80 disabled:opacity-50"
                  >
                    {isStartingCall ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Phone className="size-4" />
                        Start
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={endAgentCall}
                    className="inline-flex h-12 items-center justify-center gap-2 border border-red-500/50 bg-red-500/10 px-8 text-sm font-medium tracking-wide text-red-400 transition-all hover:bg-red-500/20"
                  >
                    <PhoneOff className="size-4" />
                    End
                  </button>
                )}

                {/* Features - only show when disconnected */}
                {agentStatus === "disconnected" && (
                  <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs text-white/40">
                    <span>~250ms response</span>
                    <span className="text-white/20">·</span>
                    <span>Tool integrations</span>
                    <span className="text-white/20">·</span>
                    <span>Knowledge bases</span>
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="mt-4 border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                  {error}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export { Playground };

"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Mic, MicOff, X, Loader2, Send } from "lucide-react";

type Status = "idle" | "connecting" | "listening" | "speaking" | "error";

export function LandingVoiceControl() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [transcript, setTranscript] = useState("");
  const [textInput, setTextInput] = useState("");

  // WebSocket and audio refs
  const wsRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const playbackContextRef = useRef<AudioContext | null>(null);
  const nextPlayTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Add visual feedback - highlight the section
  const highlightSection = useCallback((element: HTMLElement) => {
    element.classList.add("luna-highlight");
    setTimeout(() => {
      element.classList.remove("luna-highlight");
    }, 1500);
  }, []);

  // Send context update to Luna (state awareness)
  const sendContextUpdate = useCallback((message: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "user_text_message",
        text: `[System: ${message}]`,
        urgency: "later"
      }));
    }
  }, []);

  // Track current visible section
  const currentSectionRef = useRef<string | null>(null);

  // Scroll listener for state awareness
  useEffect(() => {
    const sections = ["hero", "playground", "features", "code", "deployment", "pricing", "faq", "partners", "contact"];

    const handleScroll = () => {
      // Only track if connected
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

      const scrollY = window.scrollY + window.innerHeight / 3;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const sectionTop = window.scrollY + rect.top;
          const sectionBottom = sectionTop + rect.height;

          if (scrollY >= sectionTop && scrollY < sectionBottom) {
            if (currentSectionRef.current !== sectionId) {
              currentSectionRef.current = sectionId;
              sendContextUpdate(`User scrolled to ${sectionId} section`);
            }
            break;
          }
        }
      }
    };

    // Debounce scroll handler
    let timeoutId: NodeJS.Timeout;
    const debouncedScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 300);
    };

    window.addEventListener("scroll", debouncedScroll);
    return () => {
      window.removeEventListener("scroll", debouncedScroll);
      clearTimeout(timeoutId);
    };
  }, [sendContextUpdate]);

  // Tool handlers - these control the page
  const handleTool = useCallback((toolName: string, params: any) => {
    switch (toolName) {
      case "scrollToSection":
        const sectionId = params?.section || params?.sectionId;
        if (sectionId) {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            currentSectionRef.current = sectionId;
            // Highlight after scroll completes
            setTimeout(() => highlightSection(element), 600);
          }
        }
        // Return rich context in tool result
        return `Navigated to ${sectionId} section. User is now viewing this section.`;
      case "openFaqItem":
        const faqId = params?.faqId || params?.id;
        if (faqId) {
          // Dispatch custom event to open FAQ item
          window.dispatchEvent(new CustomEvent("openFaqItem", { detail: { faqId } }));
          // Highlight the FAQ section
          setTimeout(() => {
            const faqSection = document.getElementById("faq");
            if (faqSection) highlightSection(faqSection);
          }, 600);
        }
        break;
      case "switchPlaygroundTab":
        const tab = params?.tab;
        if (tab && window.playgroundControl) {
          window.playgroundControl.switchTab(tab);
          // Highlight playground section
          setTimeout(() => {
            const playground = document.getElementById("playground");
            if (playground) highlightSection(playground);
          }, 600);
        }
        break;
      case "setTranscribeMode":
        const mode = params?.mode;
        if (mode && window.playgroundControl) {
          window.playgroundControl.setTranscribeMode(mode);
          // Highlight playground section
          setTimeout(() => {
            const playground = document.getElementById("playground");
            if (playground) highlightSection(playground);
          }, 600);
        }
        break;
      case "openDocs":
        window.open("https://docs.omnia-voice.com", "_blank");
        break;
      case "openDashboard":
        window.open("https://dashboard.omnia-voice.com/login", "_blank");
        break;
      case "openContact":
        window.open("/contact", "_blank");
        break;
      case "endSession":
        // Send hang_up and close after a brief delay
        setTimeout(() => {
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: "hang_up" }));
          }
          // Close panel after hang up
          setTimeout(() => {
            setIsOpen(false);
          }, 500);
        }, 1000);
        break;
    }
  }, []);

  // Stop all currently playing audio (for interruption)
  const stopPlayback = useCallback(() => {
    activeSourcesRef.current.forEach((source) => {
      try {
        source.stop();
      } catch {
        // Already stopped
      }
    });
    activeSourcesRef.current.clear();
    if (playbackContextRef.current) {
      nextPlayTimeRef.current = playbackContextRef.current.currentTime;
    }
  }, []);

  // Play audio from WebSocket (PCM s16le at 16kHz)
  const playAudio = useCallback(async (audioData: ArrayBuffer) => {
    try {
      let buffer = audioData;
      if (buffer.byteLength === 0) return;
      if (buffer.byteLength % 2 !== 0) {
        buffer = buffer.slice(0, buffer.byteLength - 1);
      }

      if (!playbackContextRef.current) {
        playbackContextRef.current = new AudioContext({ sampleRate: 16000 });
        nextPlayTimeRef.current = playbackContextRef.current.currentTime;
      }

      const ctx = playbackContextRef.current;

      // Convert PCM s16le to Float32
      const int16Array = new Int16Array(buffer);
      const float32Array = new Float32Array(int16Array.length);
      for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / (int16Array[i] < 0 ? 0x8000 : 0x7fff);
      }

      const audioBuffer = ctx.createBuffer(1, float32Array.length, 16000);
      audioBuffer.getChannelData(0).set(float32Array);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      activeSourcesRef.current.add(source);
      source.onended = () => {
        activeSourcesRef.current.delete(source);
      };

      const startTime = Math.max(ctx.currentTime, nextPlayTimeRef.current);
      source.start(startTime);
      nextPlayTimeRef.current = startTime + audioBuffer.duration;
    } catch {
      // Audio playback error - silently ignore
    }
  }, []);

  // Cleanup resources
  const cleanup = useCallback(() => {
    stopPlayback();

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
    if (playbackContextRef.current) {
      playbackContextRef.current.close();
      playbackContextRef.current = null;
    }
    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "hang_up" }));
      }
      wsRef.current.close();
      wsRef.current = null;
    }
    nextPlayTimeRef.current = 0;
  }, [stopPlayback]);

  // Start voice session
  const startSession = async () => {
    setStatus("connecting");
    setTranscript("");

    try {
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

      // Create call via API
      const response = await fetch("/api/voice/landing-demo", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to create call");
      }

      const { websocketUrl } = await response.json();

      // Connect to WebSocket
      const ws = new WebSocket(websocketUrl);
      ws.binaryType = "arraybuffer";
      wsRef.current = ws;

      ws.onopen = async () => {
        setStatus("listening");

        // Start sending audio
        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;

        if (audioContext.state === "suspended") {
          await audioContext.resume();
        }

        const nativeSampleRate = audioContext.sampleRate;
        const source = audioContext.createMediaStreamSource(stream);
        const processor = audioContext.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        // Resampling function
        const resample = (inputData: Float32Array, fromRate: number, toRate: number): Float32Array => {
          const ratio = fromRate / toRate;
          const newLength = Math.round(inputData.length / ratio);
          const result = new Float32Array(newLength);
          for (let i = 0; i < newLength; i++) {
            const srcIndex = i * ratio;
            const srcIndexFloor = Math.floor(srcIndex);
            const srcIndexCeil = Math.min(srcIndexFloor + 1, inputData.length - 1);
            const t = srcIndex - srcIndexFloor;
            result[i] = inputData[srcIndexFloor] * (1 - t) + inputData[srcIndexCeil] * t;
          }
          return result;
        };

        processor.onaudioprocess = (event) => {
          if (ws.readyState === WebSocket.OPEN) {
            const inputData = event.inputBuffer.getChannelData(0);
            const resampled = resample(inputData, nativeSampleRate, 16000);

            const pcm16 = new Int16Array(resampled.length);
            for (let i = 0; i < resampled.length; i++) {
              const s = Math.max(-1, Math.min(1, resampled[i]));
              pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
            }

            ws.send(pcm16.buffer);
          }
        };

        source.connect(processor);
        const muteGain = audioContext.createGain();
        muteGain.gain.value = 0;
        processor.connect(muteGain);
        muteGain.connect(audioContext.destination);
      };

      ws.onmessage = async (event) => {
        if (event.data instanceof ArrayBuffer) {
          setStatus("speaking");
          // Don't await - let audio play while other things happen
          playAudio(event.data);
        } else {
          try {
            const msg = JSON.parse(event.data);

            if (msg.type === "playback_clear_buffer") {
              stopPlayback();
            } else if (msg.type === "state") {
              if (msg.state === "listening") {
                setStatus("listening");
              } else if (msg.state === "speaking") {
                setStatus("speaking");
              }
            } else if (msg.type === "transcript") {
              if (msg.role === "agent") {
                if (msg.text) {
                  // Full text received - use it
                  setTranscript(msg.text);
                } else if (msg.delta) {
                  // Streaming delta - append it
                  setTranscript(prev => prev + msg.delta);
                }
              } else if (msg.role === "user") {
                // Clear transcript when user starts speaking
                setTranscript("");
              }
            } else if (msg.type === "client_tool_invocation") {
              // Execute tool IMMEDIATELY - don't wait
              const toolName = msg.toolName;
              const params = msg.parameters || {};

              // Run tool synchronously for instant UI response
              handleTool(toolName, params);

              // Send tool result back to the WebSocket immediately
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                  type: "client_tool_result",
                  invocationId: msg.invocationId,
                  result: "Done",
                }));
              }
            }
          } catch {
            // Failed to parse message
          }
        }
      };

      ws.onerror = () => {
        setStatus("error");
        cleanup();
      };

      ws.onclose = () => {
        setStatus("idle");
        cleanup();
      };
    } catch (err) {
      console.error("Voice session error:", err);
      setStatus("error");
      cleanup();
    }
  };

  // Stop voice session
  const stopSession = () => {
    cleanup();
    setStatus("idle");
    setTranscript("");
  };

  // Toggle session
  const toggleSession = () => {
    if (status === "idle" || status === "error") {
      startSession();
    } else {
      stopSession();
    }
  };

  // Send text message
  const sendTextMessage = () => {
    if (!textInput.trim()) return;
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    // Stop any current playback when user sends a message
    stopPlayback();

    wsRef.current.send(JSON.stringify({
      type: "user_text_message",
      text: textInput.trim(),
    }));

    setTranscript(textInput.trim());
    setTextInput("");
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Close panel
  const closePanel = () => {
    stopSession();
    setIsOpen(false);
  };

  if (!isOpen) {
    // Floating button with label
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#2D5A27] py-3 pl-4 pr-5 text-white shadow-lg transition-all hover:scale-105 hover:bg-[#2D5A27]/90"
        aria-label="Voice control"
      >
        <Mic className="size-5" />
        <span className="text-sm font-medium">Voice Guide</span>
      </button>
    );
  }

  // Open panel
  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 rounded-2xl border border-[#1a1a1a]/10 bg-white p-4 shadow-2xl">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`size-2 rounded-full ${
            status === "listening" ? "animate-pulse bg-green-500" :
            status === "speaking" ? "animate-pulse bg-blue-500" :
            status === "connecting" ? "animate-pulse bg-yellow-500" :
            status === "error" ? "bg-red-500" :
            "bg-gray-300"
          }`} />
          <span className="text-sm font-medium text-[#1a1a1a]/70">
            {status === "idle" && "Luna"}
            {status === "connecting" && "Connecting..."}
            {status === "listening" && "Luna is listening..."}
            {status === "speaking" && "Luna"}
            {status === "error" && "Connection error"}
          </span>
        </div>
        <button
          onClick={closePanel}
          className="rounded-full p-1 text-[#1a1a1a]/40 hover:bg-[#1a1a1a]/5 hover:text-[#1a1a1a]"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Luna's response */}
      {transcript && (
        <div className="mb-4 rounded-lg bg-[#2D5A27]/5 p-3">
          <p className="text-sm text-[#1a1a1a]/80">{transcript}</p>
        </div>
      )}

      {/* Mic button */}
      <div className="flex justify-center">
        <button
          onClick={toggleSession}
          disabled={status === "connecting"}
          className={`flex size-16 items-center justify-center rounded-full transition-all ${
            status === "connecting"
              ? "bg-[#1a1a1a]/10 text-[#1a1a1a]/40"
              : status === "listening" || status === "speaking"
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-[#2D5A27] text-white hover:bg-[#2D5A27]/90"
          }`}
        >
          {status === "connecting" ? (
            <Loader2 className="size-7 animate-spin" />
          ) : status === "listening" || status === "speaking" ? (
            <MicOff className="size-7" />
          ) : (
            <Mic className="size-7" />
          )}
        </button>
      </div>

      {/* Text input - only show when connected */}
      {(status === "listening" || status === "speaking") && (
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendTextMessage()}
            placeholder="Or type a message..."
            className="flex-1 rounded-lg border border-[#1a1a1a]/10 bg-[#1a1a1a]/5 px-3 py-2 text-sm text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 focus:border-[#2D5A27] focus:outline-none"
          />
          <button
            onClick={sendTextMessage}
            disabled={!textInput.trim()}
            className="flex size-9 items-center justify-center rounded-lg bg-[#2D5A27] text-white transition-all hover:bg-[#2D5A27]/90 disabled:bg-[#1a1a1a]/10 disabled:text-[#1a1a1a]/40"
          >
            <Send className="size-4" />
          </button>
        </div>
      )}

      {/* Helper text */}
      <p className="mt-4 text-center text-xs text-[#1a1a1a]/40">
        {status === "idle" && "Ask questions or navigate by voice"}
        {status === "connecting" && "Setting up..."}
        {status === "listening" && "Try: \"Show me pricing\""}
        {status === "speaking" && ""}
        {status === "error" && "Click to try again"}
      </p>

      {/* Example commands */}
      {status === "idle" && (
        <div className="mt-4 space-y-1">
          <p className="text-[10px] font-medium uppercase tracking-wide text-[#1a1a1a]/30">Try saying</p>
          <div className="flex flex-wrap gap-1">
            {["What's the latency?", "Go to pricing", "Show me features"].map((cmd) => (
              <span key={cmd} className="rounded-full bg-[#1a1a1a]/5 px-2 py-0.5 text-[10px] text-[#1a1a1a]/50">
                {cmd}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useCallback } from 'react';
import { Transcript, UltravoxSessionStatus } from 'ultravox-client';
import { endCall, startCall } from '@/lib/callFunctions';

interface UseVoiceCallOptions {
  onStatusChange?: (status: UltravoxSessionStatus | string | undefined) => void;
  onTranscriptChange?: (transcripts: Transcript[] | undefined) => void;
}

export function useVoiceCall(options?: UseVoiceCallOptions) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [agentStatus, setAgentStatus] = useState<UltravoxSessionStatus | string | undefined>('off');
  const [callTranscript, setCallTranscript] = useState<Transcript[]>([]);

  const handleStatusChange = useCallback(
    (status: UltravoxSessionStatus | string | undefined) => {
      setAgentStatus(status);
      options?.onStatusChange?.(status);
    },
    [options]
  );

  const handleTranscriptChange = useCallback(
    (transcripts: Transcript[] | undefined) => {
      if (transcripts) {
        setCallTranscript([...transcripts]);
        options?.onTranscriptChange?.(transcripts);
      }
    },
    [options]
  );

  const startVoiceCall = useCallback(async () => {
    try {
      // Call the API endpoint to get call configuration
      const response = await fetch('/api/call-config');
      if (!response.ok) {
        throw new Error('Failed to fetch call configuration');
      }
      
      const callConfig = await response.json();
      
      await startCall(
        {
          onStatusChange: handleStatusChange,
          onTranscriptChange: handleTranscriptChange,
        },
        callConfig
      )

      setIsCallActive(true);
      return true;
    } catch (error) {
      console.error('Failed to start call:', error);
      handleStatusChange(`Error: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }, [handleStatusChange, handleTranscriptChange]);

  const endVoiceCall = useCallback(async () => {
    try {
      await endCall();
      setIsCallActive(false);
      return true;
    } catch (error) {
      console.error('Failed to end call:', error);
      return false;
    }
  }, []);

  return {
    isCallActive,
    agentStatus,
    callTranscript,
    startVoiceCall,
    endVoiceCall
  };
}
'use client';
// lib/callFunctions.ts
import { UltravoxSession, UltravoxSessionStatus, Transcript, Role } from 'ultravox-client';
import { JoinUrlResponse, CallConfig } from '@/types/types';

let uvSession: UltravoxSession | null = null;

interface CallCallbacks {
  onStatusChange: (status: UltravoxSessionStatus | string | undefined) => void;
  onTranscriptChange: (transcripts: Transcript[] | undefined) => void;
}

export function toggleMute(role: Role): void {
  if (uvSession) {
    if (role === Role.USER) {
      uvSession.isMicMuted ? uvSession.unmuteMic() : uvSession.muteMic();
    }
  } else {
    console.error('uvSession is not initialized.');
  }
}

async function createCall(callConfig: CallConfig): Promise<JoinUrlResponse> {
  try {
    const response = await fetch('/api/ultravox', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...callConfig }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data: JoinUrlResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating call:', error);
    throw error;
  }
}

export async function startCall(callbacks: CallCallbacks, callConfig: CallConfig): Promise<void> {
  const callData = await createCall(callConfig);
  const joinUrl = callData.joinUrl;

  if (!joinUrl && !uvSession) {
    throw new Error('Join URL is required');
  }

  uvSession = new UltravoxSession();

  if (uvSession) {
    uvSession.addEventListener('status', () => {
      callbacks.onStatusChange(uvSession?.status);
    });

    uvSession.addEventListener('transcripts', () => {
      callbacks.onTranscriptChange(uvSession?.transcripts);
    });

    uvSession.joinCall(joinUrl);
  }
}

export async function endCall(): Promise<void> {
  if (uvSession) {
    uvSession.leaveCall();
    uvSession = null;
  }
}
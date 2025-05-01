'use client';
// lib/callFunctions.ts
import { UltravoxSession, UltravoxSessionStatus, Transcript, Role } from 'ultravox-client'; // Note: Client library name might need updating later
import { JoinUrlResponse, CallConfig } from '@/types/types';
import { API_ROUTES } from '@/lib/config';

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
    // Session not initialized
  }
}

async function createCall(): Promise<{ joinUrl: string; callId: string }> {
  try {
    // Call the server API to create a call - all configuration is handled server-side
    const response = await fetch(API_ROUTES.INTERNAL.CALL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
      // No body needed - configuration is handled server-side
    });

    let data;
    try {
      const responseText = await response.text();
      // Check for empty response
      if (!responseText.trim()) {
        throw new Error('Empty response from API');
      }
      
      data = JSON.parse(responseText);
    } catch (error) {
      // Log sanitized error without details
      throw new Error('Failed to parse API response');
    }

    if (!response.ok || data.error) {
      throw new Error(data.details || data.error || 'Unknown error');
    }

    // Check for joinUrl in the response
    const joinUrl = data.joinUrl || data.join_url;
    if (!joinUrl) {
      throw new Error('No join URL received from server');
    }

    // Only return the joinUrl and callId, keeping other details server-side
    return {
      joinUrl,
      callId: data.callId || data.call_id,
    };
  } catch (error) {
    // Throw error without logging details
    throw new Error('Error creating call');
  }
}

export async function startCall(callbacks: CallCallbacks, callConfig: any): Promise<void> {
  const callData = await createCall();
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

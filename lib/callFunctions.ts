'use client';
// lib/callFunctions.ts
import { UltravoxSession, UltravoxSessionStatus, Transcript, Role } from 'ultravox-client';
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
    console.error('uvSession is not initialized.');
  }
}

async function createCall(callConfig: CallConfig): Promise<JoinUrlResponse> {
  try {
    console.log('Creating call with config:', {
      ...callConfig,
      systemPrompt: callConfig.systemPrompt?.substring(0, 50) + '...',
    });

    const response = await fetch(API_ROUTES.INTERNAL.ULTRAVOX, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemPrompt: callConfig.systemPrompt,
        model: callConfig.model || 'fixie-ai/ultravox-70B',
        languageHint: callConfig.languageHint || 'en',
        voice: callConfig.voice || 'terrence',
        temperature: typeof callConfig.temperature === 'number' ? callConfig.temperature : 0.7,
      }),
    });

    const data = await response.json();
    console.log('Call creation response:', {
      status: response.status,
      hasJoinUrl: !!(data.joinUrl || data.join_url),
      error: data.error,
      data: data
    });

    if (!response.ok || data.error) {
      throw new Error(data.details || data.error || 'Unknown error');
    }

    // Check for either camelCase or snake_case versions of joinUrl
    const joinUrl = data.joinUrl || data.join_url;
    if (!joinUrl) {
      throw new Error('No join URL received from server');
    }

    return {
      joinUrl,
      callId: data.callId || data.call_id,
      created: data.created,
      ended: data.ended || null,
      model: data.model,
      systemPrompt: data.systemPrompt || data.system_prompt,
      temperature: data.temperature,
    };
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
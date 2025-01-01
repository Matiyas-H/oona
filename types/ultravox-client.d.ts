// types/ultravox-client.d.ts
declare module 'ultravox-client' {
  export class UltravoxSession {
    constructor(options?: { experimentalMessages?: Set<string> });
    
    status: UltravoxSessionStatus;
    transcripts: Transcript[];
    isMicMuted: boolean;
    isSpeakerMuted: boolean;

    addEventListener(event: string, callback: (event: any) => void): void;
    removeEventListener(event: string, callback: (event: any) => void): void;
    joinCall(joinUrl: string): void;
    leaveCall(): void;
    muteMic(): void;
    unmuteMic(): void;
    muteSpeaker(): void;
    unmuteSpeaker(): void;
  }

  export type UltravoxSessionStatus = string;

  export interface Transcript {
    speaker: 'agent' | 'user';
    text: string;
  }

  export enum Role {
    USER = "USER",
    AGENT = "AGENT"
  }
}
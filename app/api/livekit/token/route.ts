import { NextRequest, NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';

export async function POST(req: NextRequest) {
  try {
    const { identity, roomName } = await req.json();

    // Generate unique room name with omnia-voice branding
    const finalRoomName = roomName || `omnia-voice-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const finalIdentity = identity || `user-${Date.now()}`;

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !wsUrl) {
      return NextResponse.json(
        { error: 'LiveKit configuration missing' },
        { status: 500 }
      );
    }

    const at = new AccessToken(apiKey, apiSecret, { identity: finalIdentity });
    
    // Grant permissions for the room
    at.addGrant({
      room: finalRoomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    // Let agent auto-discover and join rooms

    const token = await at.toJwt();

    return NextResponse.json({
      token,
      wsUrl,
    });

  } catch (error) {
    console.error('Error generating LiveKit token:', error);
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    );
  }
}
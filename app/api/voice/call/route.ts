import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const voiceApiKey = process.env.OMNIA_VOICE_API_KEY;

    if (!voiceApiKey) {
      return NextResponse.json(
        { error: 'Voice service not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { agentId } = body;

    if (!agentId) {
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { status: 400 }
      );
    }

    // Create WebSocket call via Omnia API
    const response = await fetch('https://api.omnia-voice.com/api/v1/calls/create', {
      method: 'POST',
      headers: {
        'X-API-Key': voiceApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agentId,
        connectionType: 'websocket',
        websocket: {
          inputSampleRate: 16000,
          outputSampleRate: 16000,
          codec: 'pcm',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Voice API error:', response.status, errorText);

      // Parse error for better message
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error?.message?.includes('maximum')) {
          return NextResponse.json(
            { error: 'A call is already active. Please wait for it to end.' },
            { status: 429 }
          );
        }
      } catch {}

      return NextResponse.json(
        { error: 'Failed to create call', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      callId: data.id,
      websocketUrl: data.websocketUrl,
    });
  } catch (error) {
    console.error('Voice call creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

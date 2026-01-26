import { NextResponse, NextRequest } from 'next/server';
import { checkOmniaRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Check combined rate limits (5/min, 15/hour, 20/day shared with all Omnia endpoints)
    const rateLimitResult = await checkOmniaRateLimit(request);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          limit: rateLimitResult.limit,
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit,
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
            'Retry-After': rateLimitResult.retryAfter.toString(),
          },
        }
      );
    }

    const sttApiKey = process.env.OMNIA_STT_API_KEY;

    if (!sttApiKey) {
      return NextResponse.json(
        { error: 'STT service not configured' },
        { status: 500 }
      );
    }

    const contentType = request.headers.get('content-type') || 'audio/raw';
    const audioData = await request.arrayBuffer();

    if (!audioData || audioData.byteLength === 0) {
      return NextResponse.json(
        { error: 'No audio data provided' },
        { status: 400 }
      );
    }

    const response = await fetch('https://stt.omnia-voice.com/transcribe', {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        'X-API-Key': sttApiKey,
      },
      body: audioData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('STT API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Transcription failed', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    const jsonResponse = NextResponse.json(data);

    jsonResponse.headers.set('X-RateLimit-Limit', rateLimitResult.limit);
    jsonResponse.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    jsonResponse.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toString());

    return jsonResponse;
  } catch (error) {
    console.error('STT transcribe error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

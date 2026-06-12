import { NextResponse, NextRequest } from 'next/server';
import { checkOmniaRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

// Initialize a batch transcription with the signed-URL upload flow.
// The browser uploads the audio directly to storage afterwards, so file size
// never hits Vercel's request body limit.
export async function POST(request: NextRequest) {
  try {
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
      return NextResponse.json({ error: 'STT service not configured' }, { status: 500 });
    }

    const body = await request.json().catch(() => ({}));
    const contentType = typeof body.contentType === 'string' ? body.contentType : 'application/octet-stream';
    const languages = typeof body.languages === 'string' ? body.languages : undefined;
    const diarization = body.diarization === true;

    const headers: Record<string, string> = {
      'X-API-Key': sttApiKey,
      'X-Content-Type': contentType,
    };
    if (languages) headers['X-Languages'] = languages;
    if (diarization) headers['X-Diarization'] = 'true';

    const response = await fetch('https://stt.omnia-voice.com/batch/init', {
      method: 'POST',
      headers,
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('STT batch init error:', response.status, data);
      return NextResponse.json(
        { error: data.error || 'Failed to initialize transcription', code: data.code },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('STT batch init error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

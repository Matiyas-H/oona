import { NextResponse, NextRequest } from 'next/server';
import { checkOmniaRateLimit } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
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

    const response = NextResponse.json({
      wsUrl: `wss://stt.omnia-voice.com/stream?apiKey=${sttApiKey}`,
    });

    response.headers.set('X-RateLimit-Limit', rateLimitResult.limit);
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toString());

    return response;
  } catch (error) {
    console.error('STT stream URL error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

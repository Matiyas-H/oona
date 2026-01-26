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

    const voiceApiKey = process.env.OMNIA_VOICE_API_KEY;

    if (!voiceApiKey) {
      return NextResponse.json(
        { error: 'Voice service not configured' },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      apiKey: voiceApiKey,
      baseUrl: 'https://api.omnia-voice.com',
    });

    response.headers.set('X-RateLimit-Limit', rateLimitResult.limit);
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toString());

    return response;
  } catch (error) {
    console.error('Voice session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

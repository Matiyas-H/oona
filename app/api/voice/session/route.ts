import { NextResponse, NextRequest } from 'next/server';
import { checkOmniaRateLimit } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  try {
    console.log('[Voice API] Request received');

    // Check combined rate limits (5/min, 15/hour, 20/day shared with all Omnia endpoints)
    const rateLimitResult = await checkOmniaRateLimit(request);

    if (!rateLimitResult.success) {
      console.log('[Voice API] Rate limited');
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
    console.log('[Voice API] API key present:', !!voiceApiKey);

    if (!voiceApiKey) {
      console.log('[Voice API] No API key configured');
      return NextResponse.json(
        { error: 'Voice service not configured' },
        { status: 500 }
      );
    }

    console.log('[Voice API] Returning API key');
    const response = NextResponse.json({
      apiKey: voiceApiKey,
      baseUrl: 'https://api.omnia-voice.com',
    });

    response.headers.set('X-RateLimit-Limit', rateLimitResult.limit);
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toString());

    return response;
  } catch (error) {
    console.error('[Voice API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

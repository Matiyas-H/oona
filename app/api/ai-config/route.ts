// app/api/ai-config/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { headers } from 'next/headers';

// Initialize Redis for caching and rate limiting
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Create a new ratelimiter that allows 10 requests per minute
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '1 m'),
});

// Types for better error handling
type ErrorResponse = {
  status: 'error';
  error: string;
  code?: string;
};

type SuccessResponse = {
  status: 'success';
  data: {
    greeting: string;
    context: string;
    userName: string | null;
    questions: string | null; 
  };
};

async function getConfigFromCache(telyxNumber: string) {
  try {
    const cached = await redis.get(`ai-config:${telyxNumber}`);
    if (!cached) return null;
    
    // Make sure we're parsing a string
    if (typeof cached === 'string') {
      return JSON.parse(cached);
    }
    return null;
  } catch (error) {
    console.error('Cache parsing error:', error);
    return null; // Fallback to database if cache parsing fails
  }
}

async function setConfigInCache(telyxNumber: string, config: any) {
  try {
    // Ensure we're storing a string
    const stringifiedConfig = JSON.stringify(config);
    // Cache for 1 hour
    await redis.set(`ai-config:${telyxNumber}`, stringifiedConfig, { ex: 3600 });
  } catch (error) {
    console.error('Cache setting error:', error);
    // Continue execution even if caching fails
  }
}

export async function GET(request: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    // Get IP for rate limiting
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') ?? 'anonymous';
    
    // Check rate limit
    const rateLimitResult = await ratelimit.limit(ip);
    if (!rateLimitResult.success) {
      return NextResponse.json({
        status: 'error',
        error: 'Rate limit exceeded. Please try again later.',
        code: 'RATE_LIMIT_EXCEEDED'
      }, { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
        }
      });
    }

    // Validate API key
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ') || authHeader.split(' ')[1] !== process.env.API_SECRET) {
        console.log('Auth failed:', {
    hasBearer: authHeader?.startsWith('Bearer '),
    tokenMatch: authHeader?.split(' ')[1] === process.env.API_SECRET
  }); 
      return NextResponse.json({
        status: 'error',
        error: 'Invalid or missing API key',
        code: 'UNAUTHORIZED'
      }, { 
        status: 401,
        headers: {
          'WWW-Authenticate': 'Bearer'
        }
      });
    }

    // Get and validate phone number
    const { searchParams } = new URL(request.url);
    const telyxNumber = searchParams.get('phone_number')?.trim();
    console.log('Searching for number:', telyxNumber);

    if (!telyxNumber) {
      return NextResponse.json({
        status: 'error',
        error: 'Phone number is required',
        code: 'MISSING_PHONE_NUMBER'
      }, { status: 400 });
    }

    // Check cache first
    const cachedConfig = await getConfigFromCache(telyxNumber);
    if (cachedConfig) {
      return NextResponse.json({
        status: 'success',
        data: cachedConfig
      });
    }

    // If not in cache, fetch from database
    const userConfig = await prisma.userNumber.findUnique({
      where: {
        telyxNumber,
      },
      select: {
        aiGreeting: true,
        aiContext: true,
        userName: true,
        aiQuestions: true,
        aiConfig: true,
        user: {
          select: {
            name: true
          }
        }
      }
    });

    if (!userConfig) {
      return NextResponse.json({
        status: 'error',
        error: `No configuration found for number: ${telyxNumber}`,
        code: 'NUMBER_NOT_FOUND'
      }, { status: 404 });
    }

    // Use AI config if assigned, otherwise use direct settings
    const config = {
      greeting: userConfig.aiConfig?.greeting || userConfig.aiGreeting || '',
      context: userConfig.aiConfig?.context || userConfig.aiContext || '',
      userName: userConfig.userName || userConfig.user.name,
      questions: userConfig.aiConfig?.questions || userConfig.aiQuestions || ''
    };

    // Cache the result
    await setConfigInCache(telyxNumber, config);

    return NextResponse.json({
      status: 'success',
      data: config
    });

  } catch (error) {
    console.error('Error in AI config API:', error);
    
    return NextResponse.json({
      status: 'error',
      error: 'Internal Server Error',
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}
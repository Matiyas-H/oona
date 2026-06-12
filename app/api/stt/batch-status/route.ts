import { NextResponse, NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

const OPERATION_ID_PATTERN = /^batch_[a-f0-9-]+$/;

// Poll a batch transcription operation
export async function GET(request: NextRequest) {
  try {
    const sttApiKey = process.env.OMNIA_STT_API_KEY;
    if (!sttApiKey) {
      return NextResponse.json({ error: 'STT service not configured' }, { status: 500 });
    }

    const operationId = request.nextUrl.searchParams.get('id') || '';
    if (!OPERATION_ID_PATTERN.test(operationId)) {
      return NextResponse.json({ error: 'Invalid operation id' }, { status: 400 });
    }

    const response = await fetch(`https://stt.omnia-voice.com/batch/${operationId}`, {
      headers: { 'X-API-Key': sttApiKey },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('STT batch status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

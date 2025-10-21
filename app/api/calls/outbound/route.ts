import { NextRequest, NextResponse } from 'next/server';

const OMNIA_API_KEY = process.env.OMNIA_API_KEY || 'ck_prod_3c4545e5838028ec80917d0bb1e465c31a98b533275503bc462fd82f50a2e1e2';
const OMNIA_API_URL = 'https://dashboard.omnia-voice.com/api/v1/calls/outbound';
const AGENT_ID = 'cmfealzvc00028e6g8mmumwh5';
const FROM_NUMBER = '+15716241853';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Make the outbound call using Omnia Voice API
    const response = await fetch(OMNIA_API_URL, {
      method: 'POST',
      headers: {
        'X-API-Key': OMNIA_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agentId: AGENT_ID,
        phoneNumber: phoneNumber,
        fromNumber: FROM_NUMBER,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Omnia API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to initiate call', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      message: 'Call initiated successfully',
      data: data,
    });
  } catch (error) {
    console.error('Error initiating outbound call:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
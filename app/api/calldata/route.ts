// File: app/api/calldata/route.ts
import { NextRequest, NextResponse } from 'next/server'

const VAPI_API_KEY = process.env.VAPI_API_KEY
const VAPI_API_URL = process.env.VAPI_API_URL // Move this to .env.local

export async function GET(request: NextRequest) {
  if (!VAPI_API_KEY || !VAPI_API_URL) {
    return NextResponse.json({ error: 'API configuration is incomplete' }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const limit = searchParams.get('limit') || '5'

  try {
    const response = await fetch(`${VAPI_API_URL}/call?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${VAPI_API_KEY}`,
      },
    })
    
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`)
    }

    const rawData = await response.json()
    
    const processedData = rawData.map(call => ({
      summary: call.analysis?.summary || 'No summary available',
      transcript: call.transcript || 'No transcript available',
      // recordingUrl: call.recordingUrl,
      // endReport: call.messages?.find(msg => msg.type === 'end-of-call-report')?.content || 'No end report available'
    }))

    return NextResponse.json(processedData)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'An error occurred while fetching data' }, { status: 500 })
  }
}
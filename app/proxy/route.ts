// File: app/api/proxy/route.ts
import { NextRequest, NextResponse } from 'next/server'

const VAPI_API_KEY = process.env.VAPI_API_KEY

export async function GET(request: NextRequest) {
  if (!VAPI_API_KEY) {
    return NextResponse.json({ error: 'API key is not configured' }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const limit = searchParams.get('limit') || '15'

  const options = {
    method: 'GET',
    headers: { Authorization: `Bearer ${VAPI_API_KEY}` }
  };

  try {
    const response = await fetch(`https://api.vapi.ai/call?limit=${limit}`, options)
    
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`)
    }

    const data = await response.json()
    
    // Process and return only necessary data
    const processedData = data.map((item: any) => ({
      summary: item.analysis?.summary,
      transcript: item.transcript,
      recordingUrl: item.recordingUrl,
      stereoRecordingUrl: item.stereoRecordingUrl,
      endReport: item.messages?.find((msg: any) => msg.type === 'end-of-call-report')?.content
    }))

    return NextResponse.json(processedData)
  } catch (error) {
    console.error('API proxy error:', error)
    return NextResponse.json({ error: 'An error occurred while fetching data' }, { status: 500 })
  }
}
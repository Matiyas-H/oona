// File: app/api/calldata/route.ts
import { NextResponse } from 'next/server'

const VAPI_API_KEY = process.env.VAPI_API_KEY

export async function GET() {
  if (!VAPI_API_KEY) {
    return NextResponse.json({ error: 'API key is not configured' }, { status: 500 })
  }

  try {
    const response = await fetch('https://api.vapi.ai/call', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${VAPI_API_KEY}`,
      },
    })
    
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'An error occurred while fetching data' }, { status: 500 })
  }
}
// File: app/api/calldata/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { record } from 'zod'

const VAPI_API_KEY = process.env.VAPI_API_KEY
const VAPI_API_URL = process.env.VAPI_API_URL
const VAPI_ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID

export async function GET(request: NextRequest) {
  if (!VAPI_API_KEY || !VAPI_API_URL) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const limit = searchParams.get('limit') || '10'

  try {
    const response = await fetch(`${VAPI_API_URL}/call?assistantId=${VAPI_ASSISTANT_ID}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${VAPI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`Internal server error`)
    }

    const rawData = await response.json()
    
    const processedData = rawData.map(call => ({
      summary: call.analysis?.summary || 'No summary available',
      transcript: call.transcript || 'No transcript available',
      recordingUrl: call.recordingUrl || null,
      startedAt: call.startedAt,
      endedAt: call.endedAt,
      endReport: call.endReport || null,
    }))

    return NextResponse.json(processedData)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


export async function POST(request: NextRequest) {
  if (!VAPI_API_KEY || !VAPI_API_URL) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }

  const { recordingUrl } = await request.json()

  if (!recordingUrl) {
    return NextResponse.json({ error: 'Missing recordingUrl' }, { status: 400 })
  }

  try {
    const response = await fetch(recordingUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${VAPI_API_KEY}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch audio file')
    }

    const audioBuffer = await response.arrayBuffer()
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    })
  } catch (error) {
    console.error('Audio proxy error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// File: app/api/calldata/route.ts
// import { NextRequest, NextResponse } from 'next/server'
// import { format, subDays } from 'date-fns'

// const VAPI_API_KEY = process.env.VAPI_API_KEY
// const VAPI_API_URL = process.env.VAPI_API_URL
// const VAPI_ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID

// export async function GET(request: NextRequest) {
//   if (!VAPI_API_KEY || !VAPI_API_URL || !VAPI_ASSISTANT_ID) {
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
//   }

//   const { searchParams } = new URL(request.url)
//   const limit = searchParams.get('limit') || '50'

//   try {
//     // Fetch call data
//     const callDataResponse = await fetch(`${VAPI_API_URL}/call?assistantId=${VAPI_ASSISTANT_ID}&limit=${limit}`, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${VAPI_API_KEY}`,
//         'Content-Type': 'application/json',
//       },
//     })
    
//     if (!callDataResponse.ok) {
//       throw new Error(`Failed to fetch call data`)
//     }

//     const rawCallData = await callDataResponse.json()
    
//     const processedCallData = rawCallData.map(call => ({
//       summary: call.analysis?.summary || 'No summary available',
//       transcript: call.transcript || 'No transcript available',
//       // recordingUrl: call.recordingUrl || 'No recording available',
//     }))

//     // Fetch analytics data
//     const endTime = new Date()
//     const startTime = subDays(endTime, 7)

//     const analyticsPayload = {
//       queries: [
//         {
//           name: "call_analytics",
//           operations: [
//             { operation: "avg", column: "duration" },
//             { operation: "sum", column: "duration" }
//           ],
//           table: "call",
//           groupBy: ["assistantId", "endedReason"],
//           timeRange: {
//             start: format(startTime, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
//             end: format(endTime, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
//             step: "minute"
//           }
//         }
//       ]
//     }

//     const analyticsResponse = await fetch(`${VAPI_API_URL}/analytics`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${VAPI_API_KEY}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(analyticsPayload)
//     })

//     if (!analyticsResponse.ok) {
//       throw new Error('Failed to fetch analytics data')
//     }

//     const analyticsData = await analyticsResponse.json()
//     const allResults = analyticsData[0]?.result || []
//     const filteredResults = allResults.filter(item => item.assistantId === VAPI_ASSISTANT_ID)

//     const processedAnalyticsData = filteredResults.map(item => ({
//       date: format(new Date(item.date), 'yyyy-MM-dd HH:mm:ss'),
//       endedReason: item.endedReason || 'N/A',
//       avgDuration: formatDuration(item.avgDuration || 0),
//       sumDuration: formatDuration(item.sumDuration || 0)
//     }))

//     // Combine and return both datasets
//     return NextResponse.json({
//       callData: processedCallData,
//       analyticsData: processedAnalyticsData
//     })
//   } catch (error) {
//     console.error('API error:', error)
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
//   }
// }

// function formatDuration(duration: number): string {
//   const minutes = Math.floor(duration / 60)
//   const seconds = Math.floor(duration % 60)
//   return `${minutes}m ${seconds}s`
// }
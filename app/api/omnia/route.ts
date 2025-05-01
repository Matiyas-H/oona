// app/api/ultravox/route.ts
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const apiUrl = process.env.ULTRAVOX_API_URL || process.env.NEXT_PUBLIC_ULTRAVOX_API_URL;
    const apiKey = process.env.ULTRAVOX_API_KEY;
    
    console.log('Environment check:', {
      hasApiUrl: !!apiUrl,
      hasApiKey: !!apiKey,
      apiUrlPrefix: apiUrl?.substring(0, 20),
    });

    if (!apiUrl || !apiKey) {
      throw new Error(`Missing configuration: ${!apiUrl ? 'API URL' : 'API Key'}`);
    }

    // Format the request body
    const formattedBody = {
      model: body.model || "fixie-ai/ultravox-70B",
      temperature: 0.3,
      system_prompt: body.systemPrompt,
      language_hint: "fi",
      voice: "Sarah",
      first_speaker: "FIRST_SPEAKER_AGENT",
      recording_enabled: false,
      transcript_optional: false
    };

    const url = `${apiUrl}/api/calls`.replace(/\/+/g, '/').replace(':/', '://');
    console.log('Making request to:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-API-Key': apiKey,
      },
      body: JSON.stringify(formattedBody),
    });

    const responseText = await response.text();
    console.log('Ultravox API Response Status:', response.status);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}, ${responseText}`);
    }

    // Handle empty response
    if (!responseText.trim()) {
      throw new Error('Empty response from API');
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error(`Failed to parse API response: ${parseError.message}`);
    }
    if (!data.joinUrl && !data.join_url) {
      throw new Error(`Invalid response format: ${JSON.stringify(data)}`);
    }

    // Only return the joinUrl to the client for security purposes
    // Keep all other configuration details on the server side
    return NextResponse.json({
      joinUrl: data.join_url || data.joinUrl,
      callId: data.call_id || data.callId
    });
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { 
        error: 'Error calling Ultravox API',
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Add options handler for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

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
      temperature: body.temperature || 0.3,
      system_prompt: body.systemPrompt,
      language_hint: body.languageHint || "fi",
      voice: body.voice || "Sarah",
      first_speaker: "FIRST_SPEAKER_AGENT",
      recording_enabled: true,
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
    console.log('Raw API Response:', {
      status: response.status,
      text: responseText.substring(0, 200), // Log first 200 chars
      headers: Object.fromEntries(response.headers.entries()),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}, ${responseText}`);
    }

    // Handle empty response
    if (!responseText.trim()) {
      throw new Error('Empty response from API');
    }

    const data = JSON.parse(responseText);
    if (!data.joinUrl && !data.join_url) {
      throw new Error(`Invalid response format: ${JSON.stringify(data)}`);
    }

    // Return response with consistent camelCase and include all required fields
    return NextResponse.json({
      joinUrl: data.join_url || data.joinUrl,
      callId: data.call_id || data.callId,
      created: data.created,
      model: data.model,
      systemPrompt: data.system_prompt || data.systemPrompt,
      temperature: data.temperature,
      voice: data.voice,
      languageHint: data.language_hint || data.languageHint
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

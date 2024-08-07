   // File: app/api/proxy/route.ts
   import { NextRequest, NextResponse } from 'next/server';

   const VAPI_API_URL = process.env.VAPI_API_URL; // Keep this server-side

   export async function GET(request: NextRequest) {
     const { searchParams } = new URL(request.url);
     const limit = searchParams.get('limit') || '5';

     try {
       const response = await fetch(`${VAPI_API_URL}/call?limit=${limit}`, {
         method: 'GET',
         headers: {
           'Authorization': `Bearer ${process.env.VAPI_API_KEY}`,
           'Content-Type': 'application/json',
         },
       });

       if (!response.ok) {
         throw new Error(`Internal server error`);
       }

       const data = await response.json();
       return NextResponse.json(data);
     } catch (error) {
       console.error('API error:', error);
       return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
     }
   }
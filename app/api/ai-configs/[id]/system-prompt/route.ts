
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const config = await prisma.aIConfig.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      }
    });

    if (!config) {
      return NextResponse.json({ error: 'Configuration not found' }, { status: 404 });
    }

    const systemPrompt = `
You are a voice AI assistant. Follow these instructions carefully:

1. Start the conversation with this greeting:
${config.greeting}

2. Context about who you are and what you know:
${config.context}

${config.questions ? `3. After greeting, ask these questions one by one. Wait for the user to respond to each question before moving to the next:
${config.questions}` : ''}

Remember to:
- Keep responses brief and conversational
- Listen carefully to user responses
- Ask questions naturally, one at a time
- Be friendly and professional
`;

    return NextResponse.json({ systemPrompt });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
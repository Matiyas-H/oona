import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const configs = await prisma.aIConfig.findMany({
      where: { userId: user.id },
      include: {
        userNumbers: {
          select: { telyxNumber: true }
        }
      }
    });

    return NextResponse.json({ configs });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, greeting, context, questions } = await request.json();

    const config = await prisma.aIConfig.create({
      data: {
        userId: user.id,
        name,
        greeting,
        context,
        questions,
        agentId: `${user.id}-${Math.random().toString(36).substring(2, 10)}`
      }
    });

    return NextResponse.json({ config });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
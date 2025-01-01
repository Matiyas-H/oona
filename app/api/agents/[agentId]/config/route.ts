
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { agentId: string } }
) {
  try {
    const config = await prisma.aIConfig.findUnique({
      where: {
        agentId: params.agentId,
      },
      select: {
        greeting: true,
        context: true,
        questions: true,
        name: true
      }
    });

    if (!config) {
      return NextResponse.json({
        status: 'error',
        error: 'Agent configuration not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      status: 'success',
      data: config
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: 'Internal Server Error'
    }, { status: 500 });
  }
}
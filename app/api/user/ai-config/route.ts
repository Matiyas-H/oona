// app/api/user/ai-config/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(request: Request) {
  try {
    const { telyxNumber, aiGreeting, aiContext, userName, aiQuestions, aiConfigId } = await request.json();

    const updatedNumber = await prisma.userNumber.update({
      where: {
        telyxNumber: telyxNumber,
      },
      data: {
        aiGreeting,
        aiContext,
        userName,
        aiQuestions,
        aiConfigId,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedNumber,
    });
  } catch (error) {
    console.error('Error updating AI configuration:', error);
    return NextResponse.json(
      { error: 'Failed to update AI configuration' },
      { status: 500 }
    );
  }
}
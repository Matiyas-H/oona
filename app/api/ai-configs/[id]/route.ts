import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, greeting, context, questions } = await request.json();

    const config = await prisma.aIConfig.update({
      where: {
        id: params.id,
        userId: user.id
      },
      data: {
        name,
        greeting,
        context,
        questions
      }
    });

    return NextResponse.json({ config });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.aIConfig.delete({
      where: {
        id: params.id,
        userId: user.id
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const config = await prisma.aIConfig.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
      include: {
        userNumbers: {
          select: {
            telyxNumber: true,
          },
        },
      },
    });

    if (!config) {
      return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error("[AI_CONFIG_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
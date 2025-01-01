import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { numbers } = await req.json();

    // Update numbers assigned to this config
    await prisma.$transaction([
      // Remove this config from all numbers first
      prisma.userNumber.updateMany({
        where: {
          userId: user.id,
          aiConfigId: params.id,
        },
        data: {
          aiConfigId: null,
        },
      }),
      // Then assign the selected numbers
      ...numbers.map((number: string) =>
        prisma.userNumber.update({
          where: {
            telyxNumber: number,
            userId: user.id,
          },
          data: {
            aiConfigId: params.id,
          },
        })
      ),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[AI_CONFIG_NUMBERS_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
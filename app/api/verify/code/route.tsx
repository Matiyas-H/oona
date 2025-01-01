// api/verify/code/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { Twilio } from "twilio";

import { prisma } from "@/lib/db";
import { purchaseNumber } from "@/lib/twilio";

const twilioClient = new Twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!,
);

// Helper to format phone number consistently
function formatPhoneNumber(phoneNumber: string, countryCode: string) {
  let formatted = phoneNumber.replace(/\D/g, "");
  if (!formatted.startsWith("+")) {
    formatted = `${countryCode}${formatted}`;
  }
  if (!formatted.startsWith("+")) {
    formatted = `+${formatted}`;
  }
  return formatted;
}

// Helper to verify code with Twilio
async function verifyCodeWithTwilio(phoneNumber: string, code: string) {
  try {
    const verification = await twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verificationChecks.create({
        to: phoneNumber,
        code,
      });
    return verification;
  } catch (error) {
    console.error("Twilio verification error:", error);
    throw new Error(`Verification failed: ${error.message}`);
  }
}

// Helper to create database records
async function createDatabaseRecords(params: {
  userId: string;
  formattedNumber: string;
  telyxNumber: string;
  countryId: string;
  carrierId: string;
}) {
  const { userId, formattedNumber, telyxNumber, countryId, carrierId } = params;

  try {
    return await prisma.$transaction(
      async (tx) => {
        // Create verified number record
        const verifiedNumber = await tx.verifiedNumber.create({
          data: {
            userId,
            number: formattedNumber,
          },
        });

        // Create user number record
        const userNumber = await tx.userNumber.create({
          data: {
            userId,
            telyxNumber,
            countryId,
            carrierId,
          },
        });

        // Fetch forwarding codes
        const forwardingCodes = await tx.forwardingCode.findMany({
          where: { carrierId },
        });

        if (forwardingCodes.length === 0) {
          throw new Error("No forwarding codes found for carrier");
        }

        // Create services
        const userServices = await Promise.all(
          forwardingCodes.map((code) =>
            tx.userService.create({
              data: {
                userNumberId: userNumber.id,
                carrierId,
                forwardingCodeId: code.id,
                gsmCode: code.activateFormat.replace(
                  "{telynex_number}",
                  telyxNumber,
                ),
                isActive: false,
              },
            }),
          ),
        );

        return { verifiedNumber, userNumber, userServices };
      },
      {
        maxWait: 10000, // 10 seconds for DB operations
        timeout: 15000,
        isolationLevel: "Serializable",
      },
    );
  } catch (error) {
    console.error("Database transaction error:", error);
    throw error;
  }
}

// Main route handler
export async function POST(request: Request) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;

    // Validate user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.error(`User not found with ID: ${userId}`);
      return new NextResponse("User not found", { status: 404 });
    }

    // Get request data
    const { code, phoneNumber, countryCode, countryId, carrierId } =
      await request.json();
    const formattedNumber = formatPhoneNumber(phoneNumber, countryCode);

    // Step 1: Verify the code with Twilio
    const verification = await verifyCodeWithTwilio(formattedNumber, code);

    if (verification.status !== "approved") {
      return new NextResponse("Invalid verification code", { status: 400 });
    }

    // Step 2: Purchase the number
    let telyxNumber: string;
    try {
      telyxNumber = await purchaseNumber({
        userId,
        countryId,
        carrierId,
      });
    } catch (error) {
      console.error("Number purchase failed:", error);
      return new NextResponse(
        "Failed to acquire phone number. Please try again.",
        { status: 500 },
      );
    }

    // Step 3: Create database records
    try {
      const result = await createDatabaseRecords({
        userId,
        formattedNumber,
        telyxNumber,
        countryId,
        carrierId,
      });

      return NextResponse.json({
        success: true,
        status: verification.status,
        result,
      });
    } catch (error) {
      // If database operations fail, we should release/cleanup the purchased number
      // This would require implementing a cleanup function in lib/twilio.ts
      console.error("Database operations failed:", error);

      if (error.code === "P2002") {
        return new NextResponse("Number already verified", { status: 400 });
      }

      if (error.code === "P2003") {
        return new NextResponse("User does not exist", { status: 400 });
      }

      return new NextResponse(
        "Failed to complete verification. Please try again.",
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("[VERIFY_CODE]", error);
    return new NextResponse("An unexpected error occurred. Please try again.", {
      status: 500,
    });
  }
}

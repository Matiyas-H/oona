// app/api/verify/phone/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { Twilio } from "twilio";

import { prisma } from "@/lib/db";

// Initialize Twilio client
const twilioClient = new Twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!,
);

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { phoneNumber, countryCode } = await request.json();

    // Format phone number (remove spaces, dashes, etc)
    let formattedNumber = phoneNumber.replace(/\D/g, "");
    // Add country code if not present
    if (!formattedNumber.startsWith("+")) {
      formattedNumber = `${countryCode}${formattedNumber}`;
    }
    if (!formattedNumber.startsWith("+")) {
      formattedNumber = `+${formattedNumber}`;
    }

    // Check if number is already verified
    const existingVerification = await prisma.verifiedNumber.findFirst({
      where: {
        number: formattedNumber,
      },
    });

    if (existingVerification) {
      return new NextResponse("This phone number is already verified", {
        status: 400,
      });
    }

    console.log("Sending verification to:", formattedNumber);

    console.log(
      "TWILIO_VERIFY_SERVICE_SID:",
      process.env.TWILIO_VERIFY_SERVICE_SID,
    );
    console.log("Starting verification for:", {
      to: formattedNumber,
      channel: "sms",
      serviceId: process.env.TWILIO_VERIFY_SERVICE_SID,
    });

    // Start verification
    const verification = await twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verifications.create({
        to: formattedNumber,
        channel: "sms",
      });

    return NextResponse.json({
      success: true,
      status: verification.status,
    });
  } catch (error) {
    console.error("[VERIFY_PHONE]", error);
    return new NextResponse("Failed to send verification code", {
      status: 500,
    });
  }
}

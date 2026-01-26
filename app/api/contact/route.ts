import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      website,
      firstName,
      lastName,
      country,
      useCase,
      message,
      phone,
      hearAboutUs,
    } = body;

    if (!email || !firstName || !lastName || !message) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    // Send email notification
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "noreply@omnia-voice.com",
      to: "matiyas.haile@omnia-voice.com",
      reply_to: email,
      subject: `Sales inquiry from ${firstName} ${lastName}`,
      text: `
New sales inquiry from the website:

CONTACT DETAILS
---------------
Name: ${firstName} ${lastName}
Email: ${email}
Company Website: ${website || "Not provided"}
Phone: ${phone || "Not provided"}
Country: ${country || "Not provided"}

INQUIRY DETAILS
---------------
Use Case: ${useCase || "Not specified"}
How they heard about us: ${hearAboutUs || "Not specified"}

MESSAGE
-------
${message}
      `.trim(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

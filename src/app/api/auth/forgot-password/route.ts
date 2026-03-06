import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// In production, integrate with email service (Resend, SendGrid, etc.)
// For now, we simulate the flow - user would receive email with reset link

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json(
        { message: "If an account exists, you will receive a reset link" },
        { status: 200 }
      );
    }

    // TODO: Generate reset token, store in DB, send email
    // const token = crypto.randomUUID();
    // await prisma.passwordResetToken.create({ ... });
    // await sendEmail({ to: email, resetLink: `${process.env.NEXTAUTH_URL}/reset-password?token=${token}` });

    return NextResponse.json(
      { message: "If an account exists, you will receive a reset link" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

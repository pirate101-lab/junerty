import { NextResponse } from "next/server";
import { z } from "zod";

// Placeholder - In production, integrate with email service (Resend, SendGrid, etc.)
// and implement token-based password reset flow
const schema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid email" },
        { status: 400 }
      );
    }

    // TODO: Implement actual password reset:
    // 1. Generate secure token, store in DB with expiry
    // 2. Send email with reset link
    // 3. Create reset-password page that validates token
    // For now, we return success to prevent email enumeration
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

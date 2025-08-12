import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, userEmail } = body;

    if (!sessionId || !userEmail) {
      return NextResponse.json(
        { error: 'Session ID and user email are required' },
        { status: 400 }
      );
    }

    // In real implementation:
    // 1. Validate session is active
    // 2. Generate 6-digit OTP
    // 3. Send OTP via SMS to user's registered mobile
    // 4. Store OTP in database with expiration
    // 5. Log OTP generation

    // Mock OTP generation and sending
    const otp = '123456'; // In real implementation, generate random 6-digit number
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    console.log(`OTP ${otp} sent to user ${userEmail} for session ${sessionId}`);

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      sessionId,
      expiresAt: expiresAt.toISOString(),
      // In real implementation, don't return the OTP in response
      // This is only for testing purposes
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
} 
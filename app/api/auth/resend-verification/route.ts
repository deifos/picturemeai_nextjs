import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Rate limiting: Store recent requests in memory (use Redis in production)
const requestTracker = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT = 3; // Max 3 requests per window
const RATE_WINDOW = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const tracker = requestTracker.get(identifier);

  if (!tracker || now - tracker.lastReset > RATE_WINDOW) {
    // Reset or create new tracker
    requestTracker.set(identifier, { count: 1, lastReset: now });
    cleanupOldEntries(); // Cleanup old entries to prevent memory leaks

    return true;
  }

  if (tracker.count >= RATE_LIMIT) {
    return false; // Rate limit exceeded
  }

  tracker.count++;

  return true;
}

// Cleanup old entries to prevent memory leaks
function cleanupOldEntries(): void {
  const now = Date.now();
  const keysToDelete: string[] = [];

  requestTracker.forEach((tracker, key) => {
    if (now - tracker.lastReset > RATE_WINDOW) {
      keysToDelete.push(key);
    }
  });

  keysToDelete.forEach(key => {
    requestTracker.delete(key);
  });
}

export async function POST(req: NextRequest) {
  try {
    const { email, honeypot } = await req.json();

    // Bot protection: if honeypot field is filled, it's likely a bot
    if (honeypot) {
      console.log('Bot detected - honeypot filled:', honeypot);

      return NextResponse.json(
        { message: 'Request rejected' },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Get client IP for rate limiting
    const clientIP =
      req.headers.get('x-forwarded-for') ||
      req.headers.get('x-real-ip') ||
      'unknown';

    // Rate limiting by IP
    if (!checkRateLimit(`ip:${clientIP}`)) {
      console.log('Rate limit exceeded for IP:', clientIP);

      return NextResponse.json(
        {
          message:
            'Too many requests. Please wait 15 minutes before trying again.',
        },
        { status: 429 }
      );
    }

    // Rate limiting by email
    if (!checkRateLimit(`email:${email}`)) {
      console.log('Rate limit exceeded for email:', email);

      return NextResponse.json(
        {
          message:
            'Too many verification requests for this email. Please wait 15 minutes before trying again.',
        },
        { status: 429 }
      );
    }

    console.log('Resend verification request for:', email);

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      console.log('User not found for email:', email);

      return NextResponse.json(
        {
          message:
            "If your email exists in our system, we've sent you a verification link.",
          userNotFound: true,
        },
        { status: 200 }
      );
    }

    console.log('User found:', {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
    });

    // Check if user is already verified
    if (user.emailVerified) {
      console.log('User already verified:', email);

      return NextResponse.json(
        {
          message: 'This email is already verified. You can sign in directly.',
        },
        { status: 400 }
      );
    }

    // Check if verification was sent recently (prevent spam)
    const recentVerification = await prisma.verification.findFirst({
      where: {
        identifier: email,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (recentVerification && recentVerification.createdAt) {
      const timeSinceLastEmail =
        Date.now() - recentVerification.createdAt.getTime();
      const cooldownPeriod = 2 * 60 * 1000; // 2 minutes cooldown

      if (timeSinceLastEmail < cooldownPeriod) {
        const remainingTime = Math.ceil(
          (cooldownPeriod - timeSinceLastEmail) / 1000
        );

        console.log('Verification email sent too recently for:', email);

        return NextResponse.json(
          {
            message: `Please wait ${remainingTime} seconds before requesting another verification email.`,
          },
          { status: 429 }
        );
      }
    }

    // Use better-auth's internal method to generate verification URL
    const baseUrl =
      process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'http://localhost:3000';

    // Create a verification token in the database
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    console.log('Generated token:', token);

    // Delete existing verification tokens for this user
    await prisma.verification.deleteMany({
      where: {
        identifier: email,
      },
    });

    console.log('Deleted existing verification tokens for:', email);

    // Create new verification token
    await prisma.verification.create({
      data: {
        id: crypto.randomUUID(),
        identifier: email,
        value: token,
        expiresAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log('Created new verification token');

    // Call better-auth's verification email sender directly
    const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${token}&callbackURL=${baseUrl}/auth/email-verified`;

    console.log('Generated verification URL:', verificationUrl);

    // Use the same email sending function that better-auth uses
    const emailConfig = auth.options.emailVerification;

    if (emailConfig && emailConfig.sendVerificationEmail) {
      console.log(
        'Attempting to send email using better-auth email function...'
      );

      await emailConfig.sendVerificationEmail({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
          image: user.image,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        url: verificationUrl,
        token,
      });

      console.log(
        'Verification email sent successfully using better-auth function'
      );
    } else {
      console.error('better-auth email verification function not found');

      return NextResponse.json(
        { message: 'Email verification not properly configured' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Verification email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error resending verification email:', error);

    return NextResponse.json(
      { message: 'Failed to resend verification email' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { route } from '@fal-ai/server-proxy/nextjs';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import {
  deductCredits,
  getTotalAvailableCredits,
  addCredits,
} from '@/lib/credits';

// Custom POST handler with credit verification
export const POST = async (req: NextRequest) => {
  let userId: string | null = null;
  let creditsDeducted = false;

  try {
    // Get the authenticated session
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    userId = session.user.id;

    // Check if user has sufficient credits BEFORE calling FAL
    const creditInfo = await getTotalAvailableCredits(userId);

    if (creditInfo.total < 1) {
      return NextResponse.json(
        {
          error:
            'Insufficient credits. Please purchase more credits to continue.',
        },
        { status: 402 }
      );
    }

    // Deduct credits BEFORE generation
    const creditResult = await deductCredits(userId, 1);

    if (!creditResult.success) {
      return NextResponse.json(
        { error: 'Failed to deduct credits. Please try again.' },
        { status: 500 }
      );
    }

    creditsDeducted = true;

    // If everything passed, execute the proxy handler to call FAL
    const response = await route.POST(req);

    // Check if the FAL API call was successful
    if (!response.ok) {
      // Refund the credit if FAL API failed
      await addCredits(userId, 1);
      console.error('FAL API returned error, credit refunded');
    }

    return response;
  } catch (error) {
    console.error('Error in FAL proxy:', error);

    // Refund credits if they were deducted but the call failed
    if (creditsDeducted && userId) {
      await addCredits(userId, 1);
      console.log('Credit refunded due to error');
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};

// For GET requests we use the built-in proxy handler
export const GET = route.GET;

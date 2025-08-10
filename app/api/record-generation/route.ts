import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { deductCredits, recordGeneration } from '@/lib/credits';

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      prompt,
      category,
      numImages,
      imageUrls,
      imageSize,
      style,
      renderingSpeed,
      falRequestId,
    } = await request.json();

    // Validate required fields
    if (
      !prompt ||
      !category ||
      !numImages ||
      !imageUrls ||
      !Array.isArray(imageUrls)
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check and deduct credits (1 credit per generation)
    const creditResult = await deductCredits(session.user.id, 1);

    if (!creditResult.success) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 402 }
      );
    }

    // Record the generation
    const generation = await recordGeneration({
      userId: session.user.id,
      prompt,
      category,
      numImages,
      imageUrls,
      imageSize,
      style,
      renderingSpeed,
      falRequestId,
      creditsUsed: 1,
      usedFreeCredit: creditResult.usedFreeCredit,
    });

    return NextResponse.json({
      success: true,
      generationId: generation.id,
      message: 'Generation recorded successfully',
    });
  } catch (error) {
    console.error('Error processing generation:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { recordGeneration } from '@/lib/credits';

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

    // Credits are already deducted in the FAL proxy before generation
    // This endpoint just records the generation metadata for history tracking

    // Record the generation (creditsUsed is tracked, but not deducted here)
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
      usedFreeCredit: false, // This info is already tracked in the proxy deduction
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

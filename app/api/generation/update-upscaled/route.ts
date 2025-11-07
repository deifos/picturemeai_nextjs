import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { generationId, imageIndex, upscaledUrl } = await request.json();

    // Validate required fields
    if (!generationId || imageIndex === undefined || !upscaledUrl) {
      return NextResponse.json(
        {
          error:
            'Missing required fields: generationId, imageIndex, upscaledUrl',
        },
        { status: 400 }
      );
    }

    // Get the generation to verify ownership and get current arrays
    const generation = await prisma.generation.findUnique({
      where: { id: generationId },
      select: {
        userId: true,
        imageUrls: true,
        upscaledImageUrls: true,
      },
    });

    if (!generation) {
      return NextResponse.json(
        { error: 'Generation not found' },
        { status: 404 }
      );
    }

    // Verify user owns this generation
    if (generation.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Verify imageIndex is valid
    if (imageIndex < 0 || imageIndex >= generation.imageUrls.length) {
      return NextResponse.json(
        { error: 'Invalid image index' },
        { status: 400 }
      );
    }

    // Create or update upscaledImageUrls array
    const upscaledUrls = [...generation.upscaledImageUrls];

    // Ensure array is same length as imageUrls, filling with empty strings
    while (upscaledUrls.length < generation.imageUrls.length) {
      upscaledUrls.push('');
    }

    // Set the upscaled URL at the correct index
    upscaledUrls[imageIndex] = upscaledUrl;

    // Update the generation
    await prisma.generation.update({
      where: { id: generationId },
      data: {
        upscaledImageUrls: upscaledUrls,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Upscaled URL saved successfully',
    });
  } catch (error) {
    console.error('Error updating upscaled URL:', error);

    return NextResponse.json(
      { error: 'Failed to update upscaled URL' },
      { status: 500 }
    );
  }
}

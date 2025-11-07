import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { isPaidUser } from '@/lib/credits';
import { upscaleWithFal } from '@/lib/fal-client';

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is a paid user
    const userIsPaid = await isPaidUser(session.user.id);

    if (!userIsPaid) {
      return NextResponse.json(
        { error: 'Upscaling is only available for paid users' },
        { status: 403 }
      );
    }

    const { imageUrl, scale, model } = await request.json();

    // Validate required fields
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Call FAL upscale API
    const result = await upscaleWithFal({
      imageUrl,
      scale: scale || 3,
      model: model || 'RealESRGAN_x2plus',
    });

    return NextResponse.json({
      success: true,
      upscaledImageUrl: result.image.url,
      requestId: result.requestId,
    });
  } catch (error) {
    console.error('Error upscaling image:', error);

    return NextResponse.json(
      { error: 'Failed to upscale image' },
      { status: 500 }
    );
  }
}

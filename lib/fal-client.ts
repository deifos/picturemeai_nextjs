export type IdeogramStyle = 'AUTO' | 'REALISTIC' | 'FICTION';
export type ImageSize = 'square_hd' | 'portrait_16_9' | 'landscape_16_9';

export type FalGenerationParams = {
  prompt: string;
  numImages: number; // 1-4
  referenceImageUrl?: string;
  imageSize?: ImageSize;
  style?: IdeogramStyle;
  renderingSpeed?: 'BALANCED' | 'QUALITY' | 'SPEED';
};

export type FalGenerationResult = {
  requestId: string;
  images: { url: string }[];
};

import { fal } from '@fal-ai/client';

fal.config({
  proxyUrl: '/api/fal/proxy',
});

export async function uploadToFal(file: File): Promise<string> {
  const url = await fal.storage.upload(file);

  return url as string;
}

export async function generateWithFal(
  params: FalGenerationParams,
  onProgress?: (log: string) => void
): Promise<FalGenerationResult> {
  const {
    prompt,
    numImages,
    referenceImageUrl,
    imageSize = 'square_hd',
    style = 'AUTO',
    renderingSpeed = 'BALANCED',
  } = params;

  const result = await fal.subscribe('fal-ai/ideogram/character', {
    input: {
      rendering_speed: renderingSpeed,
      style,
      expand_prompt: true,
      num_images: Math.max(1, Math.min(4, numImages)),
      prompt,
      image_size: imageSize,
      reference_image_urls: referenceImageUrl ? [referenceImageUrl] : [],
    },
    logs: Boolean(onProgress),
    onQueueUpdate: update => {
      if (update.status === 'IN_PROGRESS' && onProgress) {
        update.logs.map(l => l.message).forEach(onProgress);
      }
    },
  });

  const images = (result?.data?.images || []).map((img: any) => ({
    url: img.url,
  })) as { url: string }[];

  return { requestId: String(result.requestId), images };
}

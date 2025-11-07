export type ImageSize = 'portrait_16_9' | 'landscape_16_9' | 'square_hd';
export type AspectRatio = '9:16' | '16:9' | '4:3' | '1:1';

// Map our ImageSize to nano-banana aspect ratios
const imageSizeToAspectRatio: Record<ImageSize, AspectRatio> = {
  portrait_16_9: '9:16',
  landscape_16_9: '16:9',
  square_hd: '4:3',
};

export type FalGenerationParams = {
  prompt: string;
  referenceImageUrl?: string;
  imageSize?: ImageSize;
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
  const { prompt, referenceImageUrl, imageSize = 'portrait_16_9' } = params;

  // Map imageSize to aspect_ratio for nano-banana
  const aspectRatio = imageSizeToAspectRatio[imageSize];

  const result = await fal.subscribe('fal-ai/nano-banana/edit', {
    input: {
      prompt,
      image_urls: referenceImageUrl ? [referenceImageUrl] : [],
      num_images: 1,
      output_format: 'jpeg',
      aspect_ratio: aspectRatio,
    },
    logs: Boolean(onProgress),
    onQueueUpdate: update => {
      if (update.status === 'IN_PROGRESS' && onProgress) {
        update.logs.map(l => l.message).forEach(onProgress);
      }
    },
  });

  const images = (result?.data?.images || []).map((img: { url: string }) => ({
    url: img.url,
  })) as { url: string }[];

  return { requestId: String(result.requestId), images };
}

export type UpscaleParams = {
  imageUrl: string;
  scale?: number;
  model?: 'RealESRGAN_x2plus' | 'RealESRGAN_x4plus';
};

export type UpscaleResult = {
  requestId: string;
  image: { url: string };
};

export async function upscaleWithFal(
  params: UpscaleParams,
  onProgress?: (log: string) => void
): Promise<UpscaleResult> {
  const { imageUrl, scale = 3, model = 'RealESRGAN_x2plus' } = params;

  const result = await fal.subscribe('fal-ai/esrgan', {
    input: {
      image_url: imageUrl,
      scale,
      model,
      output_format: 'jpeg',
    },
    logs: Boolean(onProgress),
    onQueueUpdate: update => {
      if (update.status === 'IN_PROGRESS' && onProgress) {
        update.logs.map(l => l.message).forEach(onProgress);
      }
    },
  });

  return {
    requestId: String(result.requestId),
    image: { url: (result.data as { image: { url: string } }).image.url },
  };
}

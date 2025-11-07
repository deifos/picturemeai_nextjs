'use client';

import { useState } from 'react';
import { Button } from '@heroui/button';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface ImageDownloadButtonProps {
  imageUrl: string;
  originalUrl: string;
  generationId: string;
  imageIndex: number;
  onImageUpscaled?: (upscaledUrl: string) => void;
}

export function ImageDownloadButton({
  imageUrl,
  originalUrl,
  generationId,
  imageIndex,
  onImageUpscaled,
}: ImageDownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      let downloadUrl = imageUrl;
      let didUpscale = false;
      const isAlreadyUpscaled = imageUrl !== originalUrl;

      // Try to upscale if not already upscaled
      if (!isAlreadyUpscaled) {
        try {
          const upscaleResponse = await fetch('/api/upscale', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl: originalUrl }),
          });

          if (upscaleResponse.ok) {
            const { upscaledImageUrl } = await upscaleResponse.json();

            downloadUrl = upscaledImageUrl;
            didUpscale = true;
            console.log('Image upscaled successfully');

            // Save the upscaled URL to the database
            try {
              await fetch('/api/generation/update-upscaled', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  generationId,
                  imageIndex,
                  upscaledUrl: upscaledImageUrl,
                }),
              });

              // Notify parent component
              onImageUpscaled?.(upscaledImageUrl);
            } catch (saveError) {
              console.error('Failed to save upscaled URL:', saveError);
            }
          } else if (upscaleResponse.status === 403) {
            console.log('Upscaling not available - downloading original');
          } else {
            console.warn('Upscaling failed, using original image');
          }
        } catch (upscaleError) {
          console.warn('Upscaling failed, using original image:', upscaleError);
        }
      }

      // Download the image
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = blobUrl;
      link.download = `picturemeai-${didUpscale ? 'upscaled-' : ''}${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to simple download
      const link = document.createElement('a');

      link.href = imageUrl;
      link.download = `picturemeai-${Date.now()}.jpg`;
      link.target = '_blank';
      link.click();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      className='absolute bottom-2 left-2'
      onClick={e => e.stopPropagation()}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.stopPropagation();
        }
      }}
    >
      <Button
        className='bg-primary/90 backdrop-blur-sm hover:bg-primary shadow-lg'
        color='primary'
        isLoading={isDownloading}
        size='sm'
        startContent={
          !isDownloading ? <ArrowDownTrayIcon className='w-4 h-4' /> : undefined
        }
        variant='solid'
        onPress={handleDownload}
      >
        {isDownloading ? 'Upscaling...' : null}
      </Button>
    </div>
  );
}

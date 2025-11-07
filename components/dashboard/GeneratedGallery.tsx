'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardBody } from '@heroui/card';
import { Spinner } from '@heroui/spinner';
import { Modal, ModalContent, ModalBody } from '@heroui/modal';
import { Button } from '@heroui/button';

import { ErrorBoundary } from '@/components/error-boundary';
import { SafeImage } from '@/components/safe-image';
import { RetentionNotice } from '@/components/dashboard/RetentionNotice';
import { ImageDeleteButton } from '@/components/dashboard/ImageDeleteButton';
import { ImageDownloadButton } from '@/components/dashboard/ImageDownloadButton';

type GeneratedItem = {
  id: string;
  url: string;
  originalUrl: string;
  generationId: string;
  imageIndex: number;
};

// Lightbox Modal Component
function LightboxModal({
  src,
  originalUrl,
  alt,
  generationId,
  imageIndex,
  onClose,
  onImageUpdated,
}: {
  src: string;
  originalUrl: string;
  alt: string;
  generationId: string;
  imageIndex: number;
  onClose: () => void;
  onImageUpdated: (upscaledUrl: string) => void;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isUpscaling, setIsUpscaling] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(src);

  // Check if already upscaled by comparing current URL with original
  const isAlreadyUpscaled = currentUrl !== originalUrl;

  // Update currentUrl when src changes
  useEffect(() => {
    setCurrentUrl(src);
  }, [src]);

  return (
    <Modal
      hideCloseButton
      backdrop='blur'
      classNames={{
        backdrop: 'bg-black/80 backdrop-blur-sm',
        base: 'bg-transparent shadow-none',
        body: 'p-0',
      }}
      isOpen={true}
      size='5xl'
      onClose={onClose}
    >
      <ModalContent>
        <ModalBody className='flex items-center justify-center min-h-[80vh]'>
          <div className='relative max-w-full max-h-full'>
            {!imageLoaded && (
              <div className='absolute inset-0 flex items-center justify-center bg-default-100 rounded-lg'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary' />
              </div>
            )}

            <SafeImage
              alt={alt}
              className='max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl'
              fill={false}
              height={1024}
              src={src}
              width={1024}
              onLoad={() => setImageLoaded(true)}
            />

            {/* Close button */}
            <Button
              isIconOnly
              className='absolute top-4 right-4 bg-black/20 backdrop-blur-sm hover:bg-black/40'
              color='default'
              size='lg'
              variant='flat'
              onPress={onClose}
            >
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  d='M6 18L18 6M6 6l12 12'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                />
              </svg>
            </Button>

            {/* Download button */}
            <Button
              className='absolute bottom-4 right-4 bg-black/20 backdrop-blur-sm hover:bg-black/40'
              color='primary'
              isLoading={isUpscaling}
              size='lg'
              startContent={
                !isUpscaling ? (
                  <svg
                    className='w-5 h-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                    />
                  </svg>
                ) : undefined
              }
              variant='flat'
              onPress={async () => {
                try {
                  setIsUpscaling(true);
                  let downloadUrl = currentUrl;
                  let didUpscale = false;

                  // If already upscaled, just download
                  if (!isAlreadyUpscaled) {
                    // Try to upscale for paid users (only if not already upscaled)
                    try {
                      const upscaleResponse = await fetch('/api/upscale', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ imageUrl: originalUrl }),
                      });

                      if (upscaleResponse.ok) {
                        const { upscaledImageUrl } =
                          await upscaleResponse.json();

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

                          // Update the UI
                          setCurrentUrl(upscaledImageUrl);
                          onImageUpdated(upscaledImageUrl);
                        } catch (saveError) {
                          console.error(
                            'Failed to save upscaled URL:',
                            saveError
                          );
                        }
                      } else if (upscaleResponse.status === 403) {
                        // User is not paid, use original image
                        console.log(
                          'Upscaling not available - downloading original'
                        );
                      } else {
                        console.warn('Upscaling failed, using original image');
                      }
                    } catch (upscaleError) {
                      console.warn(
                        'Upscaling failed, using original image:',
                        upscaleError
                      );
                    }
                  }

                  // Download the image (upscaled or original)
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

                  link.href = currentUrl;
                  link.download = `picturemeai-${Date.now()}.jpg`;
                  link.target = '_blank';
                  link.click();
                } finally {
                  setIsUpscaling(false);
                }
              }}
            >
              {isUpscaling ? 'Upscaling...' : 'Download'}
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

interface GeneratedGalleryProps {
  items: GeneratedItem[];
  loadingSpinners: string[];
  isLoadingExisting: boolean;
  onItemUpdated?: (itemId: string, newUrl: string) => void;
  onItemDeleted?: (itemId: string) => void;
}

export function GeneratedGallery({
  items,
  loadingSpinners,
  isLoadingExisting,
  onItemUpdated,
  onItemDeleted,
}: GeneratedGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const showEmptyState =
    !isLoadingExisting && items.length === 0 && loadingSpinners.length === 0;

  // Combine loading spinners and items
  const allItems = useMemo(() => {
    const placeholders = loadingSpinners.map((_, index) => ({
      id: `loading-${index}`,
      isLoading: true as const,
      url: '',
      originalUrl: '',
      generationId: '',
      imageIndex: 0,
    }));
    const itemsWithMeta = items.map(item => ({
      ...item,
      isLoading: false as const,
    }));

    return [...placeholders, ...itemsWithMeta];
  }, [items, loadingSpinners]);

  return (
    <>
      <RetentionNotice />

      <ErrorBoundary
        fallback={
          <Card>
            <CardBody className='flex items-center justify-center p-8'>
              <p className='text-danger text-sm'>Failed to load gallery</p>
            </CardBody>
          </Card>
        }
      >
        {/* Loading state for initial load */}
        {isLoadingExisting && items.length === 0 && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`loading-${i}`}
                className='relative aspect-square overflow-hidden rounded-xl border border-default-100 bg-content2/50 flex items-center justify-center'
              >
                <Spinner color='default' size='lg' />
              </div>
            ))}
          </div>
        )}

        {/* Masonry Gallery */}
        {!showEmptyState && allItems.length > 0 && (
          <div className='columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4'>
            {allItems.map((item, index) => (
              <div key={item.id} className='break-inside-avoid mb-4'>
                {item.isLoading ? (
                  <div className='relative aspect-square overflow-hidden rounded-xl border border-default-100 bg-content2/50 flex items-center justify-center'>
                    <Spinner color='default' size='lg' />
                  </div>
                ) : (
                  <div
                    className='relative overflow-hidden rounded-xl shadow-lg cursor-pointer transition-transform hover:scale-[1.02]'
                    role='button'
                    tabIndex={0}
                    onClick={() => setLightboxIndex(index)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setLightboxIndex(index);
                      }
                    }}
                  >
                    <SafeImage
                      alt={`Generated image ${index + 1}`}
                      className='w-full h-auto object-cover'
                      fill={false}
                      height={1024}
                      src={item.url}
                      width={1024}
                    />
                    {/* Download button */}
                    <ImageDownloadButton
                      generationId={item.generationId}
                      imageIndex={item.imageIndex}
                      imageUrl={item.url}
                      originalUrl={item.originalUrl}
                      onImageUpscaled={upscaledUrl =>
                        onItemUpdated?.(item.id, upscaledUrl)
                      }
                    />
                    {/* Delete button */}
                    <ImageDeleteButton
                      generationId={item.generationId}
                      itemId={item.id}
                      onDelete={itemId => onItemDeleted?.(itemId)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Lightbox - controlled by state */}
        {lightboxIndex !== null &&
          allItems[lightboxIndex] &&
          !allItems[lightboxIndex].isLoading && (
            <LightboxModal
              alt={`Generated image ${lightboxIndex + 1}`}
              generationId={allItems[lightboxIndex].generationId}
              imageIndex={allItems[lightboxIndex].imageIndex}
              originalUrl={allItems[lightboxIndex].originalUrl}
              src={allItems[lightboxIndex].url}
              onClose={() => setLightboxIndex(null)}
              onImageUpdated={upscaledUrl => {
                const item = allItems[lightboxIndex];

                if (item && onItemUpdated) {
                  onItemUpdated(item.id, upscaledUrl);
                }
              }}
            />
          )}

        {/* Empty state */}
        {showEmptyState && (
          <div className='min-h-[50vh] flex flex-col items-center justify-center gap-6 text-center'>
            <p className='text-default-500 text-sm'>
              Your generated images will appear here. Upload an image and click
              Generate to create unique variations. Each generation creates one
              unique image.
            </p>
            <div className='grid grid-cols-3 gap-4 w-full max-w-xl'>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  aria-hidden
                  className='relative aspect-square rounded-xl border-2 border-dashed border-default-200 bg-content2/40'
                />
              ))}
            </div>
          </div>
        )}
      </ErrorBoundary>
    </>
  );
}

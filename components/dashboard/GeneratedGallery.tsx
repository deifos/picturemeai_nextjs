'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardBody } from '@heroui/card';
import { Spinner } from '@heroui/spinner';
import { Modal, ModalContent, ModalBody } from '@heroui/modal';
import { Button } from '@heroui/button';

import { ErrorBoundary } from '@/components/error-boundary';
import { SafeImage } from '@/components/safe-image';
import { RetentionNotice } from '@/components/dashboard/RetentionNotice';
import { PhotoroomMasonry } from '@/components/masonry';

type GeneratedItem = { id: string; url: string };

// Lightbox Modal Component
function LightboxModal({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

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
              isIconOnly
              className='absolute bottom-4 right-4 bg-black/20 backdrop-blur-sm hover:bg-black/40'
              color='primary'
              size='lg'
              variant='flat'
              onPress={async () => {
                try {
                  const response = await fetch(src);
                  const blob = await response.blob();
                  const blobUrl = window.URL.createObjectURL(blob);
                  const link = document.createElement('a');

                  link.href = blobUrl;
                  link.download = `generated-image-${Date.now()}.jpg`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  window.URL.revokeObjectURL(blobUrl);
                } catch (error) {
                  console.error('Download failed:', error);
                  const link = document.createElement('a');

                  link.href = src;
                  link.download = `generated-image-${Date.now()}.jpg`;
                  link.target = '_blank';
                  link.click();
                }
              }}
            >
              <svg
                className='w-6 h-6'
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
}

export function GeneratedGallery({
  items,
  loadingSpinners,
  isLoadingExisting,
}: GeneratedGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const showEmptyState =
    !isLoadingExisting && items.length === 0 && loadingSpinners.length === 0;

  // Transform items to PhotoroomMasonry format
  const masonryItems = useMemo(() => {
    // Add loading placeholders
    const placeholders = loadingSpinners.map((spinnerId, index) => ({
      id: -index - 1, // Negative IDs for placeholders
      url: '',
      filename: 'Loading...',
      isPlaceholder: true,
    }));

    // Add actual items
    const actualItems = items.map((item, index) => ({
      id: index,
      url: item.url,
      filename: `Generated Image ${index + 1}`,
      isPlaceholder: false,
    }));

    return [...placeholders, ...actualItems];
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
        {!showEmptyState && masonryItems.length > 0 && (
          <PhotoroomMasonry
            items={masonryItems}
            onImageClick={index => {
              // Only open lightbox for real images (not placeholders)
              const item = masonryItems[index];

              if (!item.isPlaceholder && item.url) {
                setLightboxIndex(index);
              }
            }}
          />
        )}

        {/* Lightbox - controlled by state */}
        {lightboxIndex !== null &&
          masonryItems[lightboxIndex] &&
          !masonryItems[lightboxIndex].isPlaceholder && (
            <LightboxModal
              alt={masonryItems[lightboxIndex].filename}
              src={masonryItems[lightboxIndex].url}
              onClose={() => setLightboxIndex(null)}
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

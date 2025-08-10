'use client';

import { Card, CardBody } from '@heroui/card';
import { Spinner } from '@heroui/spinner';

import { ErrorBoundary } from '@/components/error-boundary';
import { SafeImage } from '@/components/safe-image';
import { ImageLightbox } from '@/components/image-lightbox';
import { ZoomIcon } from '@/components/icons';

type GeneratedItem = { id: string; url: string };

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
  const showEmptyState =
    !isLoadingExisting && items.length === 0 && loadingSpinners.length === 0;

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
      {/* Loading spinners for images being generated */}
      {loadingSpinners.map(spinnerId => (
        <div
          key={spinnerId}
          className='relative aspect-square overflow-hidden rounded-xl border border-default-100 bg-content2/50 flex items-center justify-center'
        >
          <Spinner color='primary' size='lg' />
        </div>
      ))}

      {/* Generated images */}
      {items.map(item => (
        <ErrorBoundary
          key={item.id}
          fallback={
            <Card className='aspect-square'>
              <CardBody className='flex items-center justify-center'>
                <p className='text-danger text-sm'>Failed to load image</p>
              </CardBody>
            </Card>
          }
        >
          <ImageLightbox alt='Generated image' src={item.url}>
            <div className='relative aspect-square overflow-hidden rounded-xl border border-default-100 bg-content2/50 group'>
              <SafeImage
                fill
                alt='Generated'
                className='object-contain object-center transition-transform group-hover:scale-105'
                src={item.url}
              />

              {/* Hover overlay with zoom icon */}
              <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100'>
                <div className='bg-white/90 backdrop-blur-sm rounded-full p-3'>
                  <ZoomIcon className='w-6 h-6 text-gray-800' />
                </div>
              </div>
            </div>
          </ImageLightbox>
        </ErrorBoundary>
      ))}

      {/* Loading state for existing images */}
      {isLoadingExisting && (
        <>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`loading-${i}`}
              className='relative aspect-square overflow-hidden rounded-xl border border-default-100 bg-content2/50 flex items-center justify-center'
            >
              <Spinner color='default' size='lg' />
            </div>
          ))}
        </>
      )}

      {/* Empty state */}
      {showEmptyState && (
        <div className='col-span-full'>
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
        </div>
      )}
    </div>
  );
}

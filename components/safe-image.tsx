'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardBody } from '@heroui/card';

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  fallback?: React.ReactNode;
  onLoad?: () => void;
}

export function SafeImage({
  src,
  alt,
  fill,
  width,
  height,
  className,
  fallback,
  onLoad,
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError) {
    return (
      fallback || (
        <Card className='w-full h-full'>
          <CardBody className='flex items-center justify-center'>
            <div className='text-center text-default-500'>
              <p className='text-sm'>Failed to load image</p>
              <p className='text-xs mt-1'>Please try generating again</p>
            </div>
          </CardBody>
        </Card>
      )
    );
  }

  return (
    <div className='relative w-full h-full'>
      {isLoading && (
        <div className='absolute inset-0 flex items-center justify-center bg-default-100 rounded-xl'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary' />
        </div>
      )}
      <Image
        unoptimized // For external images that might have CORS issues
        alt={alt}
        className={className}
        fill={fill}
        height={height}
        src={src}
        width={width}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        onLoad={() => {
          setIsLoading(false);
          onLoad?.();
        }}
      />
    </div>
  );
}

'use client';

import { useRef, useState, useCallback } from 'react';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Input } from '@heroui/input';
import { Spinner } from '@heroui/spinner';

import { uploadToFal } from '@/lib/fal-client';

interface ImageUploadSectionProps {
  previewUrl: string | null;
  onPreviewChange: (url: string | null) => void;
  onReferenceChange: (url: string | null) => void;
  error: string | null;
}

export function ImageUploadSection({
  previewUrl,
  onPreviewChange,
  onReferenceChange,
  error,
}: ImageUploadSectionProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  const handleFileChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const file = evt.target.files?.[0];

      if (!file) {
        onPreviewChange(null);
        onReferenceChange(null);
        setImageLoadError(false);

        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        console.error('Invalid file type:', file.type);
        setImageLoadError(true);

        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (file.size > maxSize) {
        console.error('File too large:', file.size);
        setImageLoadError(true);

        return;
      }

      setIsImageLoading(true);
      setImageLoadError(false);

      // Use FileReader for better mobile compatibility
      const reader = new FileReader();

      reader.onload = e => {
        const result = e.target?.result as string;

        if (result) {
          onPreviewChange(result);
          setIsImageLoading(false);
        }
      };

      reader.onerror = () => {
        console.error('FileReader error');
        setImageLoadError(true);
        setIsImageLoading(false);
      };

      // Read as data URL for preview
      reader.readAsDataURL(file);

      // Upload to FAL in parallel
      uploadToFal(file)
        .then(remoteUrl => onReferenceChange(remoteUrl))
        .catch(error => {
          console.error('Upload to FAL failed:', error);
          onReferenceChange(null);
        });
    },
    [onPreviewChange, onReferenceChange]
  );

  return (
    <Card className='bg-content1/60 border border-default-100'>
      <CardHeader className='text-large font-semibold'>Upload</CardHeader>
      <CardBody className='flex flex-col gap-6'>
        <Input
          ref={fileRef as any}
          accept='image/*'
          aria-label='Upload your image'
          type='file'
          onChange={handleFileChange}
        />

        {(previewUrl || isImageLoading) && (
          <div className='flex justify-center'>
            <div className='relative w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden border border-default-100 bg-content2/50'>
              {isImageLoading ? (
                <div className='flex items-center justify-center w-full h-full'>
                  <Spinner size='lg' />
                </div>
              ) : imageLoadError ? (
                <div className='flex flex-col items-center justify-center w-full h-full text-danger'>
                  <p className='text-sm'>Failed to load image</p>
                  <p className='text-xs'>Try a different image</p>
                </div>
              ) : previewUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt='Preview'
                    className='object-contain object-center w-full h-full'
                    src={previewUrl}
                    onError={() => {
                      console.error('Image failed to load:', previewUrl);
                      setImageLoadError(true);
                    }}
                    onLoad={() => {
                      setImageLoadError(false);
                    }}
                  />
                </>
              ) : null}
            </div>
          </div>
        )}

        {(error || imageLoadError) && (
          <Card className='border-danger-200 bg-danger-50'>
            <CardBody className='text-center'>
              <p className='text-danger text-sm'>
                {imageLoadError
                  ? 'Image could not be processed. Please try a different image format (JPG, PNG, WebP).'
                  : error}
              </p>
            </CardBody>
          </Card>
        )}
      </CardBody>
    </Card>
  );
}

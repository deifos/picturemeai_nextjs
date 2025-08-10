'use client';

import { useState, useCallback } from 'react';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Spinner } from '@heroui/spinner';
import { useDropzone } from 'react-dropzone';

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
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  const processFile = useCallback(
    (file: File) => {
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

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  const onDropRejected = useCallback(() => {
    setImageLoadError(true);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      onDropRejected,
      accept: {
        'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      },
      maxFiles: 1,
      maxSize: 10 * 1024 * 1024, // 10MB
    });

  return (
    <Card className='bg-content1/60 border border-default-100'>
      <CardHeader className='text-large font-semibold'>Upload</CardHeader>
      <CardBody className='flex flex-col gap-6'>
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-xl text-center cursor-pointer transition-all duration-200 relative overflow-hidden
            ${previewUrl ? 'p-0' : 'p-8'}
            ${
              isDragActive
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                : isDragReject || imageLoadError
                  ? 'border-danger-500 bg-danger-50 dark:bg-danger-950'
                  : previewUrl
                    ? 'border-primary-300 hover:border-primary-500'
                    : 'border-default-300 hover:border-primary-400 hover:bg-default-50'
            }
          `}
        >
          <input {...getInputProps()} />
          {isImageLoading ? (
            <div className='flex flex-col items-center gap-3 p-8'>
              <Spinner size='lg' />
              <p className='text-sm text-default-600'>Processing image...</p>
            </div>
          ) : isDragActive ? (
            <div className='flex flex-col items-center gap-3 p-8'>
              <div className='text-4xl'>📁</div>
              <p className='text-lg font-medium text-primary'>
                Drop image here
              </p>
              <p className='text-sm text-default-600'>Release to upload</p>
            </div>
          ) : previewUrl && !imageLoadError ? (
            <div className='relative group'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt='Preview'
                className='w-full h-64 object-contain bg-content2/50'
                src={previewUrl}
                onError={() => {
                  console.error('Image failed to load:', previewUrl);
                  setImageLoadError(true);
                }}
                onLoad={() => {
                  setImageLoadError(false);
                }}
              />
              {/* Overlay that appears on hover */}
              <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center'>
                <div className='text-white text-center'>
                  <div className='text-2xl mb-2'>📷</div>
                  <p className='text-sm font-medium'>Click to change image</p>
                </div>
              </div>
            </div>
          ) : (
            <div className='flex flex-col items-center gap-3'>
              <div className='text-4xl'>📷</div>
              <p className='text-lg font-medium'>Upload your image</p>
              <p className='text-sm text-default-600'>
                Drag & drop an image here, or{' '}
                <span className='text-primary underline'>click to browse</span>
              </p>
              <p className='text-xs text-default-500'>
                Supports JPG, PNG, WebP (max 10MB)
              </p>
            </div>
          )}
        </div>

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

'use client';

import { useEffect, useState } from 'react';
import { Card, CardBody } from '@heroui/card';
import { Button } from '@heroui/button';

interface ErrorToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export function ErrorToast({
  message,
  onClose,
  duration = 5000,
}: ErrorToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className='fixed top-4 right-4 z-50 max-w-md'>
      <Card className='border-danger-200 bg-danger-50 shadow-lg'>
        <CardBody className='flex flex-row items-center justify-between'>
          <div className='flex-1'>
            <p className='text-danger text-sm font-medium'>Error</p>
            <p className='text-danger-700 text-xs mt-1'>{message}</p>
          </div>
          <Button
            color='danger'
            size='sm'
            variant='light'
            onPress={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
          >
            ×
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}

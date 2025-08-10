'use client';

import { useEffect, useState } from 'react';
import { Card, CardBody } from '@heroui/card';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';

import { useCreditsStore } from '@/lib/credits-store';

interface CreditsDisplayProps {
  userId: string;
  compact?: boolean;
}

export function CreditsDisplay({
  userId,
  compact = false,
}: CreditsDisplayProps) {
  const { credits, fetchCredits } = useCreditsStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCredits = async () => {
      if (credits === null) {
        await fetchCredits();
      }
      setLoading(false);
    };

    loadCredits();
  }, [userId, credits, fetchCredits]);

  if (loading) {
    return compact ? (
      <div className='flex items-center gap-2 px-3 py-1 bg-default-100 rounded-full'>
        <div className='animate-pulse'>
          <div className='h-3 bg-default-300 rounded w-16' />
        </div>
      </div>
    ) : (
      <Card className='w-full'>
        <CardBody className='text-center'>
          <div className='animate-pulse'>
            <div className='h-4 bg-default-200 rounded w-24 mx-auto' />
          </div>
        </CardBody>
      </Card>
    );
  }

  if (compact) {
    return (
      <div className='flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-full'>
        <span className='text-xs text-default-600'>Credits:</span>
        <span className='text-sm font-bold text-primary'>
          {credits !== null ? credits : '0'}
        </span>
        {(credits === null || credits === 0) && (
          <Button
            as={Link}
            className='ml-2 h-6 px-2 text-xs'
            color='primary'
            href='/#pricing'
            size='sm'
            variant='flat'
          >
            Buy
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className='w-full bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200'>
      <CardBody className='text-center'>
        {credits === null || credits === 0 ? (
          <div className='flex items-center justify-between'>
            <div className='text-left'>
              <p className='text-sm text-default-600'>Available Credits</p>
              <p className='text-2xl font-bold text-primary'>
                {credits !== null ? credits : '0'}
              </p>
            </div>
            <Button
              as={Link}
              color='primary'
              href='/#pricing'
              size='sm'
              variant='flat'
            >
              Buy Credits
            </Button>
          </div>
        ) : (
          <div className='text-center'>
            <p className='text-sm text-default-600'>Available Credits</p>
            <p className='text-3xl font-bold text-primary mb-2'>{credits}</p>
            <p className='text-xs text-default-500'>
              Each generation uses 1 credit
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

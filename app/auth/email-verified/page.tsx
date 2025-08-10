'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Spinner } from '@heroui/spinner';

import { useSession } from '@/lib/auth-client';

function EmailVerifiedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = useSession();

  // Get invitation token and return URL from search params
  const inviteToken = searchParams.get('invite');
  const returnTo = searchParams.get('returnTo');

  useEffect(() => {
    // If user is signed in after email verification, redirect to appropriate dashboard
    if (session?.user && !isPending) {
      const redirectUser = async () => {
        try {
          // Build query parameters for auth redirect API
          const params = new URLSearchParams();

          if (inviteToken) params.set('invite', inviteToken);
          if (returnTo) params.set('returnTo', returnTo);

          const queryString = params.toString();
          const apiUrl = `/api/auth/redirect${queryString ? `?${queryString}` : ''}`;

          const response = await fetch(apiUrl);

          if (response.ok) {
            const data = await response.json();

            router.push(data.redirectUrl);
          } else {
            // Fallback: handle invitation or return URL directly
            if (inviteToken) {
              router.push(`/invite/${inviteToken}`);
            } else if (returnTo) {
              router.push(returnTo);
            } else {
              router.push('/dashboard');
            }
          }
        } catch (error) {
          console.error('Error getting redirect URL:', error);
          // Fallback: handle invitation or return URL directly
          if (inviteToken) {
            router.push(`/invite/${inviteToken}`);
          } else if (returnTo) {
            router.push(returnTo);
          } else {
            router.push('/dashboard');
          }
        }
      };

      // Add a small delay to show the success message briefly
      const timer = setTimeout(redirectUser, 2000);

      return () => clearTimeout(timer);
    }
  }, [session, isPending, router, inviteToken, returnTo]);

  if (isPending) {
    return (
      <div className='flex items-center justify-center min-h-[80vh]'>
        <Card className='w-full max-w-md bg-content1/60 border border-default-100'>
          <CardBody className='flex flex-col items-center space-y-4 p-6'>
            <Spinner color='primary' size='lg' />
            <p className='text-center text-default-500'>
              Verifying your account...
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className='flex items-center justify-center min-h-[80vh]'>
      <Card className='w-full max-w-md bg-content1/60 border border-default-100'>
        <CardHeader className='text-center pb-2'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-100'>
            <svg
              className='h-8 w-8 text-success-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                d='M5 13l4 4L19 7'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
              />
            </svg>
          </div>
          <h1 className='text-2xl font-bold text-foreground'>
            Email Verified!
          </h1>
          <p className='text-default-500'>
            Your email has been successfully verified.
          </p>
        </CardHeader>
        <CardBody className='text-center pt-0'>
          <p className='mb-4 text-default-600'>
            Thank you for verifying your email address. Your account is now
            fully activated.
          </p>
          {session?.user && (
            <div className='flex items-center justify-center gap-2 text-sm text-default-500'>
              <Spinner size='sm' />
              <span>Redirecting you to your dashboard...</span>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

function EmailVerifiedFallback() {
  return (
    <div className='flex items-center justify-center min-h-[80vh]'>
      <Card className='w-full max-w-md bg-content1/60 border border-default-100'>
        <CardBody className='flex flex-col items-center space-y-4 p-6'>
          <Spinner color='primary' size='lg' />
          <p className='text-center text-default-500'>Loading...</p>
        </CardBody>
      </Card>
    </div>
  );
}

export default function EmailVerifiedPage() {
  return (
    <Suspense fallback={<EmailVerifiedFallback />}>
      <EmailVerifiedContent />
    </Suspense>
  );
}

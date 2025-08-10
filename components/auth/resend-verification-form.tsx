'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';
import { Card, CardBody } from '@heroui/card';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';

interface ResendVerificationFormProps extends React.ComponentProps<'div'> {}

export function ResendVerificationForm({
  className,
  ...props
}: ResendVerificationFormProps) {
  const [email, setEmail] = useState<string>('');
  const [honeypot, setHoneypot] = useState<string>(''); // Bot trap
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!email) {
      setError('Email is required.');
      setIsLoading(false);

      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      setIsLoading(false);

      return;
    }

    // Bot protection: if honeypot field is filled, it's likely a bot
    if (honeypot) {
      setIsLoading(false);

      return; // Silently fail for bots
    }

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, honeypot }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to resend verification email');
      } else if (data.userNotFound) {
        // User not found but don't reveal this for security
        setError(
          'Email not found. Please make sure you&apos;re using the same email you signed up with, or create a new account.'
        );
      } else {
        setSuccess(true);
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (success) {
    return (
      <div className={`flex flex-col gap-6 ${className ?? ''}`} {...props}>
        <Card className='overflow-hidden p-0'>
          <div className='grid p-0 md:grid-cols-2'>
            <CardBody className='p-6 md:p-8'>
              <div className='mb-6'>
                <Link
                  className='inline-flex items-center text-sm text-default-500 hover:text-primary'
                  href='/auth/sign-in'
                >
                  <svg
                    className='w-4 h-4 mr-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      d='M15 19l-7-7 7-7'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                    />
                  </svg>
                  Back to Sign In
                </Link>
              </div>

              <div className='flex flex-col items-center text-center space-y-6'>
                <div className='w-16 h-16 bg-success-100 rounded-full flex items-center justify-center'>
                  <svg
                    className='w-8 h-8 text-success-600'
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
                <div>
                  <h1 className='text-2xl font-bold mb-2'>
                    Verification Email Sent!
                  </h1>
                  <p className='text-default-500 mb-4'>
                    We&apos;ve sent a new verification email to{' '}
                    <strong>{email}</strong>. Please check your inbox and follow
                    the instructions to verify your account.
                  </p>
                  <p className='text-default-400 text-sm'>
                    If you don&apos;t see the email, check your spam or junk
                    folder.
                  </p>
                </div>
                <div className='text-center text-sm space-y-2'>
                  <div>
                    Still didn&apos;t receive it?{' '}
                    <button
                      className='text-primary hover:underline'
                      onClick={() => setSuccess(false)}
                    >
                      Try again
                    </button>
                  </div>
                  <div>
                    Wrong email?{' '}
                    <Link
                      className='text-primary hover:underline'
                      href='/auth/sign-up'
                    >
                      Sign up with a different email
                    </Link>
                  </div>
                </div>
              </div>
            </CardBody>
            <div className='relative hidden md:block'>
              <Image
                fill
                priority
                alt='Authentication background'
                className='object-cover dark:brightness-[0.2] dark:grayscale'
                src='/images/auth-image.png'
              />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-6 ${className ?? ''}`} {...props}>
      <Card className='overflow-hidden p-0'>
        <div className='grid p-0 md:grid-cols-2'>
          <CardBody className='p-6 md:p-8'>
            <div className='flex flex-col gap-6'>
              <div className='mb-2'>
                <Link
                  className='inline-flex items-center text-sm text-default-500 hover:text-primary'
                  href='/auth/sign-in'
                >
                  <svg
                    className='w-4 h-4 mr-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      d='M15 19l-7-7 7-7'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                    />
                  </svg>
                  Back to Sign In
                </Link>
              </div>

              <div className='flex flex-col items-center text-center'>
                <div className='w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center mb-4'>
                  <svg
                    className='w-6 h-6 text-warning-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      d='M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                    />
                  </svg>
                </div>
                <h1 className='text-2xl font-bold'>
                  Resend Verification Email
                </h1>
                <p className='text-default-500'>
                  Didn&apos;t receive your verification email? Enter your email
                  address and we&apos;ll send you a new one.
                </p>
              </div>

              {error && (
                <div className='rounded-md bg-danger-50/20 p-3 border border-danger-200 text-danger-600 text-sm'>
                  {error}
                </div>
              )}

              {/* Email Form */}
              <form className='flex flex-col gap-4' onSubmit={onSubmit}>
                {/* Honeypot field - hidden from users, bots will fill it */}
                <input
                  autoComplete='off'
                  name='website'
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  type='text'
                  value={honeypot}
                  onChange={e => setHoneypot(e.target.value)}
                />

                <div className='flex flex-col gap-2'>
                  <label className='text-sm'>Email</label>
                  <Input
                    placeholder='Enter your email address'
                    type='email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  <p className='text-xs text-default-400'>
                    Use the same email address you used to sign up
                  </p>
                </div>

                <Button className='w-full' isDisabled={isLoading} type='submit'>
                  {isLoading ? 'Sending...' : 'Resend Verification Email'}
                </Button>
              </form>

              <div className='text-center text-sm space-y-2'>
                <div>
                  Need to sign up instead?{' '}
                  <Link className='text-primary underline' href='/auth/sign-up'>
                    Create a new account
                  </Link>
                </div>
                <div>
                  Already verified?{' '}
                  <Link className='text-primary underline' href='/auth/sign-in'>
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          </CardBody>
          <div className='relative hidden md:block'>
            <Image
              fill
              priority
              alt='Authentication background'
              className='object-cover dark:brightness-[0.2] dark:grayscale'
              src='/images/auth-image.png'
            />
          </div>
        </div>
      </Card>
      <div className='text-default-500 text-center text-xs'>
        By clicking continue, you agree to our{' '}
        <a
          className='underline hover:text-primary transition-colors'
          href='/terms'
        >
          Terms of Service
        </a>{' '}
        and{' '}
        <a
          className='underline hover:text-primary transition-colors'
          href='/privacy'
        >
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}

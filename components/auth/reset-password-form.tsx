'use client';

import { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardBody } from '@heroui/card';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';

import { authClient } from '@/lib/auth-client';

interface ResetPasswordFormProps extends React.ComponentProps<'div'> {}

export function ResetPasswordForm({
  className,
  ...props
}: ResetPasswordFormProps) {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Derive token and validation state from search params
  const token = searchParams.get('token');
  const isInvalidToken = !token;

  // Redirect to sign-in after successful password reset
  useEffect(() => {
    if (success) {
      const timeoutId = setTimeout(() => {
        router.push('/auth/sign-in');
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [success, router]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setIsLoading(true);
    setError(null);

    if (!password || !confirmPassword) {
      setError('Both password fields are required.');
      setIsLoading(false);

      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setIsLoading(false);

      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);

      return;
    }

    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (error) {
        setError(error.message || 'Failed to reset password');
      } else {
        setSuccess(true);
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Invalid token state
  if (isInvalidToken) {
    return (
      <div className={`flex flex-col gap-6 ${className ?? ''}`} {...props}>
        <Card className='overflow-hidden p-0'>
          <div className='grid p-0 md:grid-cols-2'>
            <CardBody className='p-6 md:p-8'>
              <div className='flex flex-col items-center text-center space-y-6'>
                <div className='w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center'>
                  <svg
                    className='w-8 h-8 text-danger-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.232 16.5c-.77.833.192 2.5 1.732 2.5z'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                    />
                  </svg>
                </div>
                <div>
                  <h1 className='text-2xl font-bold mb-2'>
                    Invalid Reset Link
                  </h1>
                  <p className='text-default-500'>
                    The password reset link is invalid or has expired. Please
                    request a new password reset link.
                  </p>
                </div>
                <Button
                  as={Link}
                  className='w-full'
                  href='/auth/forgot-password'
                >
                  Request New Reset Link
                </Button>
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

  // Success state
  if (success) {
    return (
      <div className={`flex flex-col gap-6 ${className ?? ''}`} {...props}>
        <Card className='overflow-hidden p-0'>
          <div className='grid p-0 md:grid-cols-2'>
            <CardBody className='p-6 md:p-8'>
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
                    Password Reset Successful
                  </h1>
                  <p className='text-default-500'>
                    Your password has been reset successfully. You&apos;ll be
                    redirected to the sign-in page shortly.
                  </p>
                </div>
                <Button as={Link} className='w-full' href='/auth/sign-in'>
                  Go to Sign In
                </Button>
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
                <div className='w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4'>
                  <svg
                    className='w-6 h-6 text-primary-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      d='M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                    />
                  </svg>
                </div>
                <h1 className='text-2xl font-bold'>Create new password</h1>
                <p className='text-default-500'>
                  Please enter your new password below.
                </p>
              </div>

              {error && (
                <div className='rounded-md bg-danger-50/20 p-3 border border-danger-200 text-danger-600 text-sm'>
                  {error}
                </div>
              )}

              {/* Password Reset Form */}
              <form className='flex flex-col gap-4' onSubmit={onSubmit}>
                <div className='flex flex-col gap-2'>
                  <label className='text-sm'>New Password</label>
                  <Input
                    placeholder='••••••••'
                    type='password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <p className='text-xs text-default-400'>
                    At least 8 characters with uppercase, lowercase, and number
                  </p>
                </div>

                <div className='flex flex-col gap-2'>
                  <label className='text-sm'>Confirm Password</label>
                  <Input
                    placeholder='••••••••'
                    type='password'
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                  />
                </div>

                <Button className='w-full' isDisabled={isLoading} type='submit'>
                  {isLoading ? 'Resetting password...' : 'Reset password'}
                </Button>
              </form>

              <div className='text-center text-sm'>
                Remember your password?{' '}
                <Link className='text-primary underline' href='/auth/sign-in'>
                  Sign in
                </Link>
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

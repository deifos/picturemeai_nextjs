'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardBody } from '@heroui/card';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import Link from 'next/link';

import { GoogleIcon } from '@/components/icons';
import { authClient } from '@/lib/auth-client';

interface AuthSignInFormProps extends React.ComponentProps<'div'> {}

export function AuthSignInForm({ className, ...props }: AuthSignInFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get('invite') || undefined;
  const returnTo = searchParams.get('returnTo') || undefined;
  const callbackURL = returnTo;

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);
      if (inviteToken) {
        await authClient.signIn.social({
          provider: 'google',
          callbackURL: `/invite/${inviteToken}`,
        });
      } else if (callbackURL) {
        await authClient.signIn.social({ provider: 'google', callbackURL });
      } else {
        await authClient.signIn.social({
          provider: 'google',
          callbackURL: '/dashboard',
        });
      }
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
      console.error('Google auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    if (!email || !password) {
      setError('Email and password are required.');
      setIsLoading(false);

      return;
    }

    try {
      const { error: signInError } = await authClient.signIn.email(
        { email, password, callbackURL, rememberMe: true },
        {
          onRequest: () => setIsLoading(true),
          onSuccess: async () => {
            try {
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
                if (inviteToken) router.push(`/invite/${inviteToken}`);
                else if (returnTo) router.push(returnTo);
                else router.push('/dashboard');
              }
            } catch (err) {
              console.error('Error getting redirect URL:', err);
              if (inviteToken) router.push(`/invite/${inviteToken}`);
              else if (returnTo) router.push(returnTo);
              else router.push('/dashboard');
            }
          },
          onError: (ctx: any) => {
            const errorMessage = ctx?.error?.message || 'Sign in failed';

            console.log('Better-auth sign-in error:', errorMessage);
            console.log('Full error context:', ctx);
            setError(errorMessage);
          },
        }
      );

      if (signInError) setError(signInError.message || 'Sign in failed');
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col gap-6 ${className ?? ''}`} {...props}>
      <Card className='overflow-hidden p-0'>
        <div className='grid p-0 md:grid-cols-2'>
          <CardBody className='p-6 md:p-8'>
            <div className='flex flex-col gap-6'>
              <div className='flex flex-col items-center text-center'>
                <h1 className='text-2xl font-bold'>Welcome back</h1>
                <p className='text-default-500'>
                  {inviteToken
                    ? 'Sign in to accept your team invitation'
                    : 'Sign in to your account'}
                </p>
              </div>

              {error && (
                <div className='rounded-md bg-danger-50/20 p-3 border border-danger-200 text-danger-600 text-sm'>
                  {error}
                  {(error.toLowerCase().includes('verify') ||
                    error.toLowerCase().includes('verification') ||
                    error.toLowerCase().includes('unverified') ||
                    error.toLowerCase().includes('email not verified') ||
                    error.toLowerCase().includes('not verified') ||
                    error.toLowerCase().includes('403')) && (
                    <div className='mt-2 pt-2 border-t border-danger-200'>
                      <Link
                        className='text-primary underline hover:no-underline'
                        href='/auth/resend-verification'
                      >
                        Resend verification email →
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <div className='grid grid-cols-1 gap-4'>
                <Button
                  className='w-full'
                  isDisabled={isLoading}
                  variant='bordered'
                  onPress={handleGoogleAuth}
                >
                  <GoogleIcon className='mr-2' size={16} />
                  Continue with Google
                </Button>
              </div>

              <div className='relative'>
                <div className='border-t border-default-200' />
                <span className='absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-content1 px-2 text-xs text-default-500 uppercase'>
                  Or continue with email
                </span>
              </div>

              <form className='flex flex-col gap-4' onSubmit={onSubmit}>
                <div className='flex flex-col gap-2'>
                  <label className='text-sm'>Email</label>
                  <Input
                    placeholder='m@example.com'
                    type='email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <div className='flex justify-between items-center'>
                    <label className='text-sm'>Password</label>
                    <Link
                      className='text-xs text-primary'
                      href='/auth/forgot-password'
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    placeholder='••••••••'
                    type='password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
                <Button className='w-full' isDisabled={isLoading} type='submit'>
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </Button>
              </form>

              <div className='text-center text-sm space-y-2'>
                <div>
                  Don&apos;t have an account?{' '}
                  <Link
                    className='underline'
                    href={`/auth/sign-up${inviteToken ? `?invite=${inviteToken}` : ''}`}
                  >
                    Sign up
                  </Link>
                </div>
                <div>
                  Didn&apos;t receive verification email?{' '}
                  <Link
                    className='text-primary underline'
                    href='/auth/resend-verification'
                  >
                    Resend verification
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

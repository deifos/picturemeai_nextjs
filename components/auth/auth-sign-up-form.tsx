'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Card, CardBody } from '@heroui/card';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';

import { GoogleIcon } from '@/components/icons';
import { authClient } from '@/lib/auth-client';

interface AuthSignUpFormProps extends React.ComponentProps<'div'> {}

export function AuthSignUpForm({ className, ...props }: AuthSignUpFormProps) {
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get('invite') || undefined;
  const returnTo = searchParams.get('returnTo') || undefined;
  const callbackURL = returnTo;

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let redirectURL = '/dashboard';

      if (inviteToken) {
        redirectURL = `/invite/${inviteToken}`;
      } else if (callbackURL) {
        redirectURL = callbackURL;
      }

      await authClient.signIn.social({
        provider: 'google',
        callbackURL: redirectURL,
      });
    } catch (err) {
      setError('Failed to sign up with Google. Please try again.');
      console.error('Google auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!firstName || !lastName || !email || !password) {
      setError('All fields are required.');
      setIsLoading(false);

      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setIsLoading(false);

      return;
    }

    try {
      let redirectURL = '/auth/email-verified';

      if (inviteToken) {
        redirectURL += `?invite=${inviteToken}`;
      }

      const { error } = await authClient.signUp.email(
        {
          email,
          password,
          name: `${firstName} ${lastName}`,
          callbackURL: redirectURL,
        },
        {
          onRequest: () => setIsLoading(true),
          onSuccess: () => {
            setSuccess(true);
          },
          onError: (ctx: any) =>
            setError(ctx.error.message || 'Sign up failed'),
        }
      );

      if (error) {
        setError(error.message || 'Sign up failed');
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
                  <h1 className='text-2xl font-bold mb-2'>Account Created!</h1>
                  <p className='text-default-500'>
                    Please check your email for a verification link. You need to
                    verify your email before you can sign in.
                  </p>
                </div>
                <div className='text-center text-sm'>
                  Already verified?{' '}
                  <Link
                    className='text-primary underline'
                    href={`/auth/sign-in${inviteToken ? `?invite=${inviteToken}` : ''}`}
                  >
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
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-6 ${className ?? ''}`} {...props}>
      <Card className='overflow-hidden p-0'>
        <div className='grid p-0 md:grid-cols-2'>
          <CardBody className='p-6 md:p-8'>
            <div className='flex flex-col gap-6'>
              <div className='flex flex-col items-center text-center'>
                <h1 className='text-2xl font-bold'>Create your account</h1>
                <p className='text-default-500'>
                  {inviteToken
                    ? 'Create an account to accept your team invitation'
                    : 'Sign up for your PictureMe AI account'}
                </p>
              </div>

              {error && (
                <div className='rounded-md bg-danger-50/20 p-3 border border-danger-200 text-danger-600 text-sm'>
                  {error}
                  {(error.includes('already exists') ||
                    error.includes('already taken')) && (
                    <div className='mt-2 pt-2 border-t border-danger-200'>
                      <p className='text-xs mb-1'>
                        Account already exists but not verified?
                      </p>
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

              {/* Google Sign Up */}
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

              {/* Email/Password Form */}
              <form className='flex flex-col gap-4' onSubmit={onSubmit}>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='flex flex-col gap-2'>
                    <label className='text-sm' htmlFor='first-name-input'>
                      First name
                    </label>
                    <Input
                      id='first-name-input'
                      placeholder='John'
                      type='text'
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className='flex flex-col gap-2'>
                    <label className='text-sm' htmlFor='last-name-input'>
                      Last name
                    </label>
                    <Input
                      id='last-name-input'
                      placeholder='Doe'
                      type='text'
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className='flex flex-col gap-2'>
                  <label className='text-sm' htmlFor='email-input'>
                    Email
                  </label>
                  <Input
                    id='email-input'
                    placeholder='john@example.com'
                    type='email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>

                <div className='flex flex-col gap-2'>
                  <label className='text-sm' htmlFor='password-input'>
                    Password
                  </label>
                  <Input
                    id='password-input'
                    placeholder='••••••••'
                    type='password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <p className='text-xs text-default-400'>
                    At least 8 characters with uppercase, lowercase, and number
                  </p>
                </div>

                <Button className='w-full' isDisabled={isLoading} type='submit'>
                  {isLoading ? 'Creating account...' : 'Create account'}
                </Button>
              </form>

              <div className='text-center text-sm'>
                Already have an account?{' '}
                <Link
                  className='text-primary underline'
                  href={`/auth/sign-in${inviteToken ? `?invite=${inviteToken}` : ''}`}
                >
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

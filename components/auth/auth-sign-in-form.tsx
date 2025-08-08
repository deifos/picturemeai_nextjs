'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { authClient } from '@/lib/auth-client';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';

// Form validation schema
const signInSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

type SignInFormData = z.infer<typeof signInSchema>;

interface AuthSignInFormProps extends React.ComponentProps<'div'> {}

export function AuthSignInForm({ className, ...props }: AuthSignInFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get invitation token and return URL from search params
  const inviteToken = searchParams.get('invite');
  const returnTo = searchParams.get('returnTo');
  // Don't set a specific callback URL - let the server determine the redirect based on team membership
  const callbackURL = returnTo || undefined;

  // Form setup
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // For Google auth, we need to handle the redirect differently
      // since it's handled by the OAuth provider
      if (inviteToken) {
        await authClient.signIn.social({
          provider: 'google',
          callbackURL: `/invite/${inviteToken}`,
        });
      } else if (callbackURL) {
        await authClient.signIn.social({
          provider: 'google',
          callbackURL: callbackURL,
        });
      } else {
        // Redirect directly to dashboard for OAuth sign-ins
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

  const onSubmit = async (values: SignInFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await authClient.signIn.email(
        {
          email: values.email,
          password: values.password,
          callbackURL,
          rememberMe: true,
        },
        {
          onRequest: () => setIsLoading(true),
          onSuccess: async () => {
            // Get the appropriate redirect URL with invitation context
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
          },
          onError: ctx => setError(ctx.error.message || 'Sign in failed'),
        }
      );

      if (error) {
        setError(error.message || 'Sign in failed');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  {inviteToken
                    ? 'Sign in to accept your team invitation'
                    : 'Sign in to your FeedbackBasket account'}
                </p>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-3 border border-red-200">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Google Sign In */}
              <div className="grid grid-cols-1 gap-4">
                <Button
                  variant="outline"
                  type="button"
                  className="w-full"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="mr-2 h-4 w-4"
                    >
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                  Continue with Google
                </Button>
              </div>

              <div className="relative">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-muted-foreground uppercase">
                  Or continue with email
                </span>
              </div>

              {/* Email/Password Form */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="m@example.com"
                            type="email"
                            autoComplete="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between">
                          <FormLabel>Password</FormLabel>
                          <Link
                            href="/auth/forgot-password"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <FormControl>
                          <Input
                            placeholder="••••••••"
                            type="password"
                            autoComplete="current-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign in'
                    )}
                  </Button>
                </form>
              </Form>

              <div className="text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link
                  href={`/auth/sign-up${inviteToken ? `?invite=${inviteToken}` : ''}`}
                  className="underline underline-offset-4"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
          <div className="bg-muted relative hidden md:block">
            <Image
              src="/feedback-basket-login.png"
              alt="Authentication background"
              fill
              className="object-cover dark:brightness-[0.2] dark:grayscale"
              priority
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground text-center text-xs text-balance">
        By clicking continue, you agree to our{' '}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}

'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { authClient } from '@/lib/auth-client';
import { Loader2, ArrowLeft, Lock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
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

// Form validation schema
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      }),
    confirmPassword: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps extends React.ComponentProps<'div'> {}

export function ResetPasswordForm({ className, ...props }: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Derive token and validation state from search params
  const token = searchParams.get('token');
  const isInvalidToken = !token;

  // Form setup
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Redirect to sign-in after successful password reset
  useEffect(() => {
    if (success) {
      const timeoutId = setTimeout(() => {
        router.push('/auth/sign-in');
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [success, router]);

  const onSubmit = async (values: ResetPasswordFormData) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await authClient.resetPassword({
        newPassword: values.password,
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
      <div className={cn('flex flex-col gap-6', className)} {...props}>
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="p-6 md:p-8">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold mb-2">Invalid Reset Link</h1>
                  <p className="text-muted-foreground text-balance">
                    The password reset link is invalid or has expired. Please request a new password
                    reset link.
                  </p>
                </div>
                <Button asChild className="w-full">
                  <Link href="/auth/forgot-password">Request New Reset Link</Link>
                </Button>
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
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className={cn('flex flex-col gap-6', className)} {...props}>
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="p-6 md:p-8">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold mb-2">Password Reset Successful</h1>
                  <p className="text-muted-foreground text-balance">
                    Your password has been reset successfully. You&apos;ll be redirected to the
                    sign-in page shortly.
                  </p>
                </div>
                <Button asChild className="w-full">
                  <Link href="/auth/sign-in">Go to Sign In</Link>
                </Button>
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
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="mb-2">
                <Link
                  href="/auth/sign-in"
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Sign In
                </Link>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold">Create new password</h1>
                <p className="text-muted-foreground text-balance">
                  Please enter your new password below.
                </p>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-3 border border-red-200">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Password Reset Form */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="••••••••"
                            type="password"
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="••••••••"
                            type="password"
                            autoComplete="new-password"
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
                        Resetting password...
                      </>
                    ) : (
                      'Reset password'
                    )}
                  </Button>
                </form>
              </Form>

              <div className="text-center text-sm">
                Remember your password?{' '}
                <Link href="/auth/sign-in" className="underline underline-offset-4">
                  Sign in
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

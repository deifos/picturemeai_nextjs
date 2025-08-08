'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { authClient } from '@/lib/auth-client';
import { Loader2, ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps extends React.ComponentProps<'div'> {}

export function ForgotPasswordForm({ className, ...props }: ForgotPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form setup
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await authClient.forgetPassword({
        email: values.email,
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        setError(error.message || 'Failed to send reset link');
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
      <div className={cn('flex flex-col gap-6', className)} {...props}>
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="p-6 md:p-8">
              <div className="mb-6">
                <Link
                  href="/auth/sign-in"
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Sign In
                </Link>
              </div>

              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold mb-2">Check your email</h1>
                  <p className="text-muted-foreground text-balance">
                    If your email exists in our system, we&apos;ve sent you a password reset link.
                    Please check your inbox and follow the instructions.
                  </p>
                </div>
                <div className="text-center text-sm">
                  Didn&apos;t receive the email?{' '}
                  <button
                    onClick={() => setSuccess(false)}
                    className="text-blue-600 hover:underline"
                  >
                    Try again
                  </button>
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
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold">Reset your password</h1>
                <p className="text-muted-foreground text-balance">
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </p>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-3 border border-red-200">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Email Form */}
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

                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending reset link...
                      </>
                    ) : (
                      'Send reset link'
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

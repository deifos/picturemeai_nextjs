'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { authClient } from '@/lib/auth-client';
import { Loader2, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
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
const signUpSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    }),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

interface AuthSignUpFormProps extends React.ComponentProps<'div'> {}

export function AuthSignUpForm({ className, ...props }: AuthSignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();

  // Get invitation token from search params
  const inviteToken = searchParams.get('invite');

  // Form setup
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Build callback URL with invitation context
      let callbackURL = '/auth/email-verified';
      if (inviteToken) {
        callbackURL = `/invite/${inviteToken}`;
      }
      
      await authClient.signIn.social({
        provider: 'google',
        callbackURL,
      });
    } catch (err) {
      setError('Failed to sign up with Google. Please try again.');
      console.error('Google auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: SignUpFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Build callback URL with invitation context
      let callbackURL = '/auth/email-verified';
      if (inviteToken) {
        callbackURL += `?invite=${inviteToken}`;
      }

      const { error } = await authClient.signUp.email(
        {
          email: values.email,
          password: values.password,
          name: `${values.firstName} ${values.lastName}`,
          callbackURL,
        },
        {
          onRequest: () => setIsLoading(true),
          onSuccess: () => {
            setSuccess(true);
          },
          onError: ctx => setError(ctx.error.message || 'Sign up failed'),
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
      <div className={cn('flex flex-col gap-6', className)} {...props}>
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="p-6 md:p-8">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold mb-2">Account Created!</h1>
                  <p className="text-muted-foreground text-balance">
                    Please check your email for a verification link. You need to verify your email
                    before you can sign in.
                  </p>
                </div>
                <div className="text-center text-sm">
                  Already verified?{' '}
                  <Link
                    href={`/auth/sign-in${inviteToken ? `?invite=${inviteToken}` : ''}`}
                    className="underline underline-offset-4"
                  >
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
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-muted-foreground text-balance">
                  {inviteToken
                    ? 'Create an account to accept your team invitation'
                    : 'Sign up for your FeedbackBasket account'}
                </p>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-3 border border-red-200">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Google Sign Up */}
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
                  Sign up with Google
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
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="john@example.com"
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
                        <FormLabel>Password</FormLabel>
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
                        Creating account...
                      </>
                    ) : (
                      'Create account'
                    )}
                  </Button>
                </form>
              </Form>

              <div className="text-center text-sm">
                Already have an account?{' '}
                <Link
                  href={`/auth/sign-in${inviteToken ? `?invite=${inviteToken}` : ''}`}
                  className="underline underline-offset-4"
                >
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

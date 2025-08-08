'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Loader2 } from 'lucide-react';

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
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center space-y-4 p-6">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-center text-muted-foreground">Verifying your account...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Email Verified!</CardTitle>
          <CardDescription>Your email has been successfully verified.</CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p className="mb-4">
            Thank you for verifying your email address. Your account is now fully activated.
          </p>
          {session?.user && <p className="text-sm">Redirecting you to your dashboard...</p>}
        </CardContent>
      </Card>
    </div>
  );
}

function EmailVerifiedFallback() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center space-y-4 p-6">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-center text-muted-foreground">Loading...</p>
        </CardContent>
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

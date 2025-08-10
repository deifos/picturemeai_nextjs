import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import { AuthSignUpForm } from '@/components/auth/auth-sign-up-form';

interface SignUpPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  // Check if user is already logged in
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const params = await searchParams;
  const inviteToken = params.invite as string;
  const returnTo = params.returnTo as string;

  // If user is already logged in, handle invitation or redirect
  if (session) {
    if (inviteToken) {
      // User is logged in and has an invitation token - redirect to invitation page
      redirect(`/invite/${inviteToken}`);
    } else if (returnTo) {
      // User is logged in and has a return URL
      redirect(returnTo);
    } else {
      // Default redirect to dashboard
      redirect('/dashboard');
    }
  }

  return (
    <div className='bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm md:max-w-3xl relative'>
        <AuthSignUpForm />
      </div>
    </div>
  );
}

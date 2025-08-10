import { ResendVerificationForm } from '@/components/auth/resend-verification-form';

export default function ResendVerificationPage() {
  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <div className='w-full max-w-4xl'>
        <ResendVerificationForm />
      </div>
    </div>
  );
}

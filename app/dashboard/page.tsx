import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { DashboardClient } from './DashboardClient';

import { auth } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect('/auth/sign-in');

  return <DashboardClient />;
}

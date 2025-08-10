import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';

import { DashboardClient } from './DashboardClient';

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect('/auth/sign-in');

  return <DashboardClient />;
}

'use client';

import { usePathname } from 'next/navigation';

import { Navbar } from '@/components/navbar';
import { DashboardNavbar } from '@/components/dashboard-navbar';
import { useSession } from '@/lib/auth-client';

export function ConditionalNavbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Use dashboard navbar for dashboard routes
  if (pathname?.startsWith('/dashboard')) {
    return <DashboardNavbar userId={session?.user.id} />;
  }

  // Use regular navbar for all other routes
  return <Navbar />;
}

'use client';

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/dropdown';
import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';

import { useSession, signOut } from '@/lib/auth-client';

export function UserMenu() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  if (isPending) {
    return (
      <div className='w-8 h-8 animate-pulse bg-default-200 rounded-full' />
    );
  }

  if (!session) {
    return (
      <Button
        as={NextLink}
        color='primary'
        href='/auth/sign-in'
        size='sm'
        variant='flat'
      >
        Sign In
      </Button>
    );
  }

  const handleLogout = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push('/auth/sign-in');
          },
        },
      });
    } catch (error) {
      console.error('Failed to sign out:', error);
      // Fallback redirect even if signOut fails
      router.push('/auth/sign-in');
    }
  };

  const userEmail = session.user.email;
  const userName = session.user.name || userEmail?.split('@')[0];
  const userImage = session.user.image;

  return (
    <Dropdown placement='bottom-end'>
      <DropdownTrigger>
        <Avatar
          isBordered
          as='button'
          className='transition-transform'
          name={userName || undefined}
          size='sm'
          src={userImage || undefined}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label='Profile Actions' variant='flat'>
        <DropdownItem
          key='profile'
          className='h-14 gap-2'
          textValue='User info'
        >
          <p className='font-semibold'>Signed in as</p>
          <p className='font-semibold text-default-600'>{userEmail}</p>
        </DropdownItem>
        <DropdownItem key='dashboard' as={NextLink} href='/dashboard'>
          Dashboard
        </DropdownItem>
        <DropdownItem key='settings'>Settings</DropdownItem>
        <DropdownItem key='help'>Help & Feedback</DropdownItem>
        <DropdownItem key='logout' color='danger' onPress={handleLogout}>
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

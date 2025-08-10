'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

interface SmoothScrollLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  color?:
    | 'foreground'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function SmoothScrollLink({
  href,
  children,
  className,
  color,
  size,
}: SmoothScrollLinkProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (e: any) => {
    // Check if it's a hash link
    if (href.startsWith('/#')) {
      e.preventDefault();
      const targetId = href.substring(2); // Remove "/#"

      // If we're not on the home page, navigate to home first
      if (pathname !== '/') {
        router.push('/');
        // Wait for navigation then scroll
        setTimeout(() => {
          const element = document.getElementById(targetId);

          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      } else {
        // We're already on home page, just scroll
        const element = document.getElementById(targetId);

        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  // Convert HeroUI props to CSS classes
  const getLinkClasses = () => {
    const baseClasses = 'transition-colors hover:opacity-80';
    const colorClasses = {
      foreground: 'text-foreground',
      primary: 'text-primary',
      secondary: 'text-secondary',
      success: 'text-success',
      warning: 'text-warning',
      danger: 'text-danger',
    };
    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };

    return [
      baseClasses,
      color && colorClasses[color],
      size && sizeClasses[size],
      className,
    ]
      .filter(Boolean)
      .join(' ');
  };

  return (
    <Link className={getLinkClasses()} href={href} onClick={handleClick}>
      {children}
    </Link>
  );
}

import '@/styles/globals.css';
import { Metadata, Viewport } from 'next';
import { Link } from '@heroui/link';
import Script from 'next/script';
import clsx from 'clsx';

import { GitHubIcon } from '@/components/icons/GitHubIcon';
import { XIcon } from '@/components/icons/XIcon';

import { siteConfig } from '@/config/site';
import { fontSans } from '@/config/fonts';
import { ConditionalNavbar } from '@/components/conditional-navbar';

import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang='en'>
      <head />
      <body
        className={clsx(
          'min-h-screen text-foreground bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
          <div className='relative flex flex-col h-screen bg-gradient-to-br from-default-100 to-background'>
            <ConditionalNavbar />
            <main className='pt-0 flex-grow snap-y snap-mandatory'>
              {children}
            </main>
            <footer className='w-full flex items-center justify-center py-2 border-t border-default-50'>
              <div className='flex flex-wrap items-center justify-center gap-2 text-xs'>
                <Link
                  className='text-default-400 hover:text-default-600 transition-colors'
                  href='/terms'
                >
                  Terms
                </Link>
                <span className='text-default-200'>•</span>
                <Link
                  className='text-default-400 hover:text-default-600 transition-colors'
                  href='/privacy'
                >
                  Privacy
                </Link>
                <span className='text-default-200'>•</span>
                <Link
                  isExternal
                  className='text-default-400 hover:text-default-600 transition-colors'
                  href='https://fal.ai'
                  title='Powered by FAL AI'
                >
                  FAL AI
                </Link>
                <span className='text-default-200'>•</span>
                <Link
                  isExternal
                  className='flex items-center gap-1 text-default-400 hover:text-default-600 transition-colors'
                  href='https://x.com/deifosv'
                  title='Find me on X'
                >
                  <XIcon className='w-3 h-3' />
                  <span>Find me on X</span>
                </Link>
                <span className='text-default-200'>•</span>
                <Link
                  isExternal
                  className='flex items-center gap-1.5 text-default-700 hover:text-primary transition-colors font-medium bg-default-100 hover:bg-default-200 px-2 py-1 rounded-md'
                  href='https://github.com/deifos/picturemeai_nextjs'
                  title='Clone this project'
                >
                  <GitHubIcon className='w-3.5 h-3.5' />
                  <span>Clone me</span>
                </Link>
              </div>
            </footer>
          </div>
        </Providers>

        {/* Feedback Basket Widget built by vlad, if you clone this poject check out feedbackbasket.com :) */}
        <Script
          src='https://www.feedbackbasket.com/api/widget/script/cme3q0an50001jm04d6extjp1'
          strategy='lazyOnload'
        />
      </body>
    </html>
  );
}

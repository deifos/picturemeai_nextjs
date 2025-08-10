import '@/styles/globals.css';
import { Metadata, Viewport } from 'next';
import { Link } from '@heroui/link';
import Script from 'next/script';
import clsx from 'clsx';

import { Providers } from './providers';

import { siteConfig } from '@/config/site';
import { fontSans } from '@/config/fonts';
import { ConditionalNavbar } from '@/components/conditional-navbar';

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
            <footer className='w-full flex items-center justify-center gap-3 py-3 border-t border-default-100 bg-default-50/50'>
              <div className='flex flex-wrap items-center justify-center gap-3 text-xs'>
                <Link
                  className='text-default-500 hover:text-primary transition-colors'
                  href='/terms'
                >
                  Terms of Service
                </Link>
                <span className='text-default-300'>•</span>
                <Link
                  className='text-default-500 hover:text-primary transition-colors'
                  href='/privacy'
                >
                  Privacy Policy
                </Link>
                <span className='text-default-300'>•</span>
                <Link
                  isExternal
                  className='flex items-center gap-1 text-current hover:text-primary transition-colors'
                  href='https://fal.ai'
                  title='fal.ai homepage'
                >
                  <span className='text-default-500'>Powered by</span>
                  <span className='text-default-700 font-medium'>FAL AI</span>
                </Link>
                <span className='text-default-300'>•</span>
                <Link
                  isExternal
                  className='flex items-center gap-1 text-current hover:text-primary transition-colors'
                  href='https://x.com/deifosv'
                  title='Built by Vlad'
                >
                  <span className='text-default-500'>Built with</span>
                  <span>💛</span>
                  <span className='text-default-500'>by</span>
                  <span className='text-default-700 font-medium'>Vlad</span>
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

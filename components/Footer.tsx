import { Link } from '@heroui/link';

import { GitHubIcon, XIcon } from '@/components/icons';

export function Footer() {
  return (
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
  );
}

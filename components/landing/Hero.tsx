'use client';

import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import { Snippet } from '@heroui/snippet';
import { Chip } from '@heroui/chip';
import { motion, Variants } from 'framer-motion';
import Image from 'next/image';

import { subtitle, title } from '@/components/primitives';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Hero() {
  return (
    <section className='w-full min-h-screen snap-start flex items-center overflow-hidden'>
      <div className='container mx-auto max-w-7xl px-4 sm:px-6 py-6 md:py-8 w-full'>
        <motion.div
          animate='visible'
          className='grid gap-6 sm:gap-8 md:grid-cols-2 items-center w-full'
          initial='hidden'
          variants={staggerContainer}
        >
          <motion.div
            className='flex flex-col gap-4 w-full max-w-full'
            variants={fadeUp}
          >
            <h1 className={title({ size: 'lg' })}>
              Your face. Infinite looks.
              <br />
              <span className={title({ color: 'violet', size: 'lg' })}>
                From one photo.
              </span>
            </h1>
            <motion.p
              className={subtitle({ class: 'mt-2 md:w-3/4 max-w-full' })}
              variants={fadeUp}
            >
              Upload a single photo and get a consistent gallery of you across
              styles, outfits, and settings in seconds.
            </motion.p>
            <motion.div
              className='flex items-center gap-2 mt-1'
              variants={fadeUp}
            >
              <span className='text-success text-sm font-medium'>
                ✨ 1 free image generation
              </span>
              <span className='text-default-500 text-sm'>
                • No credit card required
              </span>
            </motion.div>
            <motion.div className='flex flex-wrap gap-3' variants={fadeUp}>
              <Button
                as={Link}
                color='primary'
                href='/dashboard'
                radius='full'
                size='lg'
              >
                Try for Free
              </Button>
              <Button
                as={Link}
                href='#how-it-works'
                radius='full'
                size='lg'
                variant='bordered'
              >
                See how it works
              </Button>
            </motion.div>
            <motion.div className='mt-2 w-full max-w-full' variants={fadeUp}>
              <Snippet
                hideCopyButton
                hideSymbol
                className='bg-content2/50 text-xs sm:text-sm max-w-full break-words'
                variant='bordered'
              >
                <span className='block sm:hidden'>
                  No training wait. Just upload & generate.
                </span>
                <span className='hidden sm:block'>
                  No training wait. No complexity. Just upload and generate.
                </span>
              </Snippet>
            </motion.div>
          </motion.div>

          <motion.div
            className='flex justify-center w-full px-2 sm:px-0'
            variants={scaleIn}
          >
            <motion.div
              animate='visible'
              className='w-full max-w-[280px] sm:max-w-[320px] md:max-w-xl aspect-square'
              initial='hidden'
              variants={staggerContainer}
            >
              <div className='grid grid-cols-3 grid-rows-3 gap-1 sm:gap-2 md:gap-3 h-full'>
                {(() => {
                  const samples = [
                    '/images/sample1.png',
                    '/images/sample2.png',
                    '/images/sample3.png',
                    '/images/sample4.png',
                    '/images/sample5.png',
                    '/images/sample6.png',
                    '/images/sample7.png',
                    '/images/sample8.png',
                    '/images/sample9.png',
                  ];
                  const cells = Array.from({ length: 9 }, (_, i) => i);
                  let k = 0;

                  return cells.map(i => {
                    const isCenter = i === 4;
                    const src = isCenter
                      ? '/images/original.jpg'
                      : samples[k++ % samples.length];

                    return (
                      <motion.div
                        key={i}
                        className='relative rounded-xl sm:rounded-2xl overflow-hidden border border-default-200 shadow-xl bg-content1/70'
                        variants={scaleIn}
                        whileHover={{ scale: 1.02 }}
                      >
                        <Image
                          fill
                          alt={isCenter ? 'Original' : `Variant ${i + 1}`}
                          className='object-cover'
                          src={src}
                        />
                        {isCenter && (
                          <div className='absolute bottom-1 sm:bottom-2 right-1 sm:right-2 z-10'>
                            <Chip
                              className='text-xs font-medium'
                              color='secondary'
                              size='sm'
                              variant='solid'
                            >
                              Original
                            </Chip>
                          </div>
                        )}
                      </motion.div>
                    );
                  });
                })()}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

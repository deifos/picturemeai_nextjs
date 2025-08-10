'use client';

import { Card, CardBody, CardHeader } from '@heroui/card';
import { motion, Variants } from 'framer-motion';
import Image from 'next/image';

import { title } from '@/components/primitives';

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

export function Features() {
  return (
    <section
      className='w-full min-h-screen snap-start flex items-center'
      id='features'
    >
      <div className='container mx-auto max-w-7xl px-6 py-14'>
        <motion.h2
          className={title({
            size: 'md',
            fullWidth: true,
            className: 'text-center',
          })}
          initial='hidden'
          variants={fadeUp}
          viewport={{ once: true }}
          whileInView='visible'
        >
          Why choose PictureMe AI
        </motion.h2>

        <motion.div
          className='grid grid-cols-1 lg:grid-cols-4 gap-4 mt-12'
          initial='hidden'
          variants={staggerContainer}
          viewport={{ once: true }}
          whileInView='visible'
        >
          {/* Main feature - High Consistency (spans 2 columns) */}
          <motion.div className='lg:col-span-2 lg:row-span-2' variants={fadeUp}>
            <Card className='bg-content1/60 border border-default-100 h-full p-6'>
              <CardHeader className='pb-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-3 h-3 bg-primary rounded-full' />
                  <h3 className='text-xl font-semibold'>High Consistency</h3>
                </div>
              </CardHeader>
              <CardBody className='pt-0'>
                <p className='text-default-600 mb-6'>
                  Your identity stays perfectly intact across every style and
                  scene. Same face, unlimited possibilities.
                </p>

                {/* Consistency showcase grid */}
                <div className='grid grid-cols-3 gap-3'>
                  <div className='relative aspect-square rounded-xl overflow-hidden'>
                    <Image
                      fill
                      alt='Original'
                      className='object-cover'
                      src='/images/concistency/original.jpg'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent' />
                    <div className='absolute bottom-2 left-2 text-white text-xs font-medium'>
                      Original
                    </div>
                  </div>
                  <div className='relative aspect-square rounded-xl overflow-hidden'>
                    <Image
                      fill
                      alt='Style 1'
                      className='object-cover'
                      src='/images/concistency/concistency1.jpg'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent' />
                  </div>
                  <div className='relative aspect-square rounded-xl overflow-hidden'>
                    <Image
                      fill
                      alt='Style 2'
                      className='object-cover'
                      src='/images/concistency/concistency2.jpg'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent' />
                  </div>
                  <div className='relative aspect-square rounded-xl overflow-hidden'>
                    <Image
                      fill
                      alt='Style 3'
                      className='object-cover'
                      src='/images/concistency/concistency3.jpg'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent' />
                  </div>
                  <div className='relative aspect-square rounded-xl overflow-hidden'>
                    <Image
                      fill
                      alt='Style 4'
                      className='object-cover'
                      src='/images/concistency/concistency4.jpg'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent' />
                  </div>
                  <div className='relative aspect-square rounded-xl overflow-hidden'>
                    <Image
                      fill
                      alt='Style 5'
                      className='object-cover'
                      src='/images/concistency/concistency5.jpg'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent' />
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Studio Quality */}
          <motion.div className='lg:col-span-2' variants={fadeUp}>
            <Card className='bg-content1/60 border border-default-100 h-full p-6'>
              <CardHeader className='pb-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-3 h-3 bg-secondary rounded-full' />
                  <h3 className='text-xl font-semibold'>Studio Quality</h3>
                </div>
              </CardHeader>
              <CardBody className='pt-0'>
                <p className='text-default-600 mb-4'>
                  Professional-grade results with crisp lighting, clean
                  compositions, and natural skin tones that rival expensive
                  photo shoots.
                </p>
                <div className='flex gap-2'>
                  {['HDR Lighting', 'Pro Retouching'].map(feature => (
                    <div
                      key={feature}
                      className='px-3 py-1 bg-default-100 rounded-full text-xs font-medium'
                    >
                      {feature}
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Blazing Fast */}
          <motion.div className='lg:col-span-1' variants={fadeUp}>
            <Card className='bg-content1/60 border border-default-100 h-full p-6'>
              <CardHeader className='pb-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-3 h-3 bg-success rounded-full' />
                  <h3 className='text-lg font-semibold'>⚡ Blazing Fast</h3>
                </div>
              </CardHeader>
              <CardBody className='pt-0'>
                <p className='text-default-600 text-sm mb-4'>
                  Generate dozens of professional looks in seconds, not hours.
                </p>
                <div className='text-2xl font-bold text-primary'>~30s</div>
                <div className='text-xs text-default-500'>per generation</div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Easy to Use */}
          <motion.div className='lg:col-span-1' variants={fadeUp}>
            <Card className='bg-content1/60 border border-default-100 h-full p-6'>
              <CardHeader className='pb-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-3 h-3 bg-warning rounded-full' />
                  <h3 className='text-lg font-semibold'>🎯 Easy to Use</h3>
                </div>
              </CardHeader>
              <CardBody className='pt-0'>
                <p className='text-default-600 text-sm mb-4'>
                  Just upload one photo and let AI do the magic.
                </p>
                <div className='text-2xl font-bold text-primary'>3</div>
                <div className='text-xs text-default-500'>simple steps</div>
              </CardBody>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

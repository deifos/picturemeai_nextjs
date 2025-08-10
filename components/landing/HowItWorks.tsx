'use client';

import { Card, CardBody } from '@heroui/card';
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
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

export function HowItWorks() {
  const steps = [
    {
      step: 1,
      title: 'Upload one photo',
      description:
        "Any clear portrait works great. Selfie, headshot, or professional photo - we'll handle the rest.",
      icon: '📷',
    },
    {
      step: 2,
      title: 'Choose your style',
      description:
        'Pick from professional, creative, lifestyle themes and let our AI understand your vision.',
      icon: '🎨',
    },
    {
      step: 3,
      title: 'Generate & download',
      description:
        'Get a consistent gallery of professional images in seconds. Your face, unlimited possibilities.',
      icon: '✨',
    },
  ];

  return (
    <section
      className='w-full min-h-screen snap-start flex items-center'
      id='how-it-works'
    >
      <div className='container mx-auto max-w-7xl px-6 py-16'>
        <motion.h2
          className={title({
            size: 'md',
            fullWidth: true,
            className: 'text-center mb-4',
          })}
          initial='hidden'
          variants={fadeUp}
          viewport={{ once: true }}
          whileInView='visible'
        >
          How it works
        </motion.h2>
        <motion.p
          className='text-center text-default-600 text-lg mb-12'
          initial='hidden'
          variants={fadeUp}
          viewport={{ once: true }}
          whileInView='visible'
        >
          Transform yourself in three simple steps
        </motion.p>

        {/* Steps section - Top */}
        <motion.div
          className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-12'
          initial='hidden'
          variants={staggerContainer}
          viewport={{ once: true }}
          whileInView='visible'
        >
          {steps.map(step => (
            <motion.div key={step.step} variants={fadeUp}>
              <Card className='bg-content1/60 border border-default-100 hover:border-primary/30 transition-colors h-full'>
                <CardBody className='p-4 text-center'>
                  <div className='flex flex-col items-center gap-3'>
                    <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 text-white grid place-items-center font-bold text-sm shadow-lg'>
                      {step.step}
                    </div>
                    <div className='space-y-1'>
                      <div className='flex items-center justify-center gap-2'>
                        <span className='text-xl'>{step.icon}</span>
                        <h3 className='text-lg font-semibold'>{step.title}</h3>
                      </div>
                      <p className='text-default-600 text-sm leading-relaxed'>
                        {step.description}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Screenshot section - Full width */}
        <motion.div
          className='w-full'
          initial='hidden'
          variants={fadeUp}
          viewport={{ once: true }}
          whileInView='visible'
        >
          <div className='relative'>
            {/* Background decoration */}
            <div className='absolute -inset-8 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-3xl blur-3xl' />

            {/* Main screenshot container */}
            <div className='relative bg-content1/80 backdrop-blur-sm border border-default-200 rounded-3xl p-6 shadow-2xl'>
              <div className='relative aspect-[16/10] rounded-2xl overflow-hidden'>
                <Image
                  fill
                  priority
                  alt='PictureMe AI Dashboard Screenshot'
                  className='object-cover object-top'
                  src='/images/screenshot-pictureai.png'
                />

                {/* Overlay with subtle gradient */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent' />
              </div>
            </div>

            {/* Decorative elements */}
            <div className='absolute top-16 -left-16 w-32 h-32 bg-primary/5 rounded-full blur-2xl' />
            <div className='absolute bottom-16 -right-16 w-40 h-40 bg-secondary/5 rounded-full blur-2xl' />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

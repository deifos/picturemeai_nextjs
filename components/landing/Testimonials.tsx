'use client';

import { Card, CardBody } from '@heroui/card';
import { Avatar } from '@heroui/avatar';
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
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const testimonials = [
  {
    quote:
      'This is incredible! I got 20 professional headshots in minutes that look better than my $500 photo shoot. The consistency is mind-blowing.',
    name: 'Sarah Chen',
    role: 'Content Creator',
    avatar: 'SC',
    rating: 5,
    images: ['/images/sample1.png', '/images/sample2.png'],
  },
  {
    quote:
      'As a freelancer, I needed professional photos for different niches. PictureMe AI gave me everything from corporate to creative shots - all from one selfie.',
    name: 'Marcus Rodriguez',
    role: 'Digital Marketer',
    avatar: 'MR',
    rating: 5,
    images: ['/images/sample3.png', '/images/sample4.png'],
  },
  {
    quote:
      'I was skeptical about AI photos, but these look so natural. My LinkedIn connections are asking where I got them done. The secret is out now! 😄',
    name: 'Emily Johnson',
    role: 'Product Manager',
    avatar: 'EJ',
    rating: 5,
  },
  {
    quote:
      "Replaced my entire portfolio in 30 minutes. The quality is insane - my clients can&apos;t tell these aren't from a real studio session.",
    name: 'David Kim',
    role: 'Creative Director',
    avatar: 'DK',
    rating: 5,
    images: ['/images/sample5.png', '/images/sample6.png'],
  },
  {
    quote:
      'Perfect for my personal brand. Got professional shots, casual lifestyle photos, and even some creative portraits. Worth every penny!',
    name: 'Jessica Torres',
    role: 'Entrepreneur',
    avatar: 'JT',
    rating: 5,
  },
  {
    quote:
      'The variety is amazing! From boardroom shots to travel lifestyle pics - all maintaining perfect facial consistency. This is the future of photography.',
    name: 'Alex Thompson',
    role: 'Tech Founder',
    avatar: 'AT',
    rating: 5,
    images: ['/images/sample7.png', '/images/sample8.png'],
  },
];

export function Testimonials() {
  return (
    <section className='w-full min-h-screen snap-start flex items-center overflow-hidden'>
      <div className='container mx-auto max-w-7xl px-4 sm:px-6 py-16 w-full'>
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
          What users are saying
        </motion.h2>
        <motion.p
          className='text-center text-default-600 text-lg mt-4 mb-12'
          initial='hidden'
          variants={fadeUp}
          viewport={{ once: true }}
          whileInView='visible'
        >
          Join thousands who&apos;ve transformed their professional image
        </motion.p>

        <motion.div
          className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'
          initial='hidden'
          variants={staggerContainer}
          viewport={{ once: true }}
          whileInView='visible'
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={fadeUp}>
              <Card className='bg-content1/60 border border-default-100 hover:border-primary/30 transition-colors h-full'>
                <CardBody className='p-4 sm:p-6'>
                  <div className='flex flex-col gap-4'>
                    {/* Rating stars */}
                    <div className='flex gap-1'>
                      {Array.from({ length: testimonial.rating }).map(
                        (_, i) => (
                          <span key={i} className='text-warning text-lg'>
                            ⭐
                          </span>
                        )
                      )}
                    </div>

                    {/* Quote */}
                    <blockquote className='text-default-700 leading-relaxed'>
                      &quot;{testimonial.quote}&quot;
                    </blockquote>

                    {/* Sample images if available */}
                    {testimonial.images && (
                      <div className='flex gap-2 sm:gap-4 mt-4 overflow-hidden'>
                        {testimonial.images.map((image, imgIndex) => (
                          <div
                            key={imgIndex}
                            className='relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-xl overflow-hidden border-2 border-default-200 hover:border-primary/50 transition-colors cursor-pointer group flex-shrink-0'
                          >
                            <Image
                              fill
                              alt={`Result by ${testimonial.name}`}
                              className='object-cover group-hover:scale-105 transition-transform'
                              src={image}
                            />
                            <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
                          </div>
                        ))}
                        <div className='flex items-center justify-center w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gradient-to-br from-default-100 to-default-50 rounded-xl border-2 border-dashed border-default-300 hover:border-primary/50 transition-colors flex-shrink-0'>
                          <div className='text-center'>
                            <span className='block text-default-600 text-sm sm:text-lg font-medium'>
                              +18
                            </span>
                            <span className='block text-default-400 text-xs sm:text-sm'>
                              more
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Author */}
                    <div className='flex items-center gap-3 mt-auto pt-2'>
                      <Avatar
                        className='bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-medium'
                        name={testimonial.avatar}
                        size='sm'
                      />
                      <div>
                        <div className='font-semibold text-sm'>
                          {testimonial.name}
                        </div>
                        <div className='text-default-500 text-xs'>
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          className='mt-12 text-center'
          initial='hidden'
          variants={fadeUp}
          viewport={{ once: true }}
          whileInView='visible'
        >
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-default-500'>
            <div className='flex items-center gap-2'>
              <span className='text-xl sm:text-2xl'>⭐</span>
              <span className='text-xs sm:text-sm font-medium'>
                4.9/5 average rating
              </span>
            </div>
            <div className='hidden sm:block w-px h-4 bg-default-300' />
            <div className='flex items-center gap-2'>
              <span className='text-xl sm:text-2xl'>👥</span>
              <span className='text-xs sm:text-sm font-medium'>
                10,000+ happy users
              </span>
            </div>
            <div className='hidden sm:block w-px h-4 bg-default-300' />
            <div className='flex items-center gap-2'>
              <span className='text-xl sm:text-2xl'>🚀</span>
              <span className='text-xs sm:text-sm font-medium'>
                500k+ images generated
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

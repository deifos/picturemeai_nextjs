'use client';

import { Card, CardBody, CardHeader } from '@heroui/card';
import { Button } from '@heroui/button';
import { motion, Variants } from 'framer-motion';
import { useState } from 'react';

import { title } from '@/components/primitives';
import { redirectToCheckout } from '@/lib/stripe-client';
import { ErrorToast } from '@/components/error-toast';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Pricing() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = async (plan: 'STARTER' | 'CREATOR') => {
    try {
      setLoadingPlan(plan);
      setError(null);

      // Get price ID from environment variables (client-side)
      const priceId =
        plan === 'STARTER'
          ? process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID
          : process.env.NEXT_PUBLIC_STRIPE_CREATOR_PRICE_ID;

      if (!priceId) {
        throw new Error(
          'Stripe configuration is missing. Please contact support.'
        );
      }

      await redirectToCheckout(priceId);
    } catch (error) {
      console.error('Error starting checkout:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to start checkout. Please try again.';

      setError(errorMessage);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section
      className='w-full min-h-screen snap-start flex items-center'
      id='pricing'
    >
      <div className='container mx-auto max-w-7xl px-6 py-16'>
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
          Simple pricing
        </motion.h2>
        <motion.p
          className='text-default-600 mt-2 text-center'
          initial='hidden'
          variants={fadeUp}
          viewport={{ once: true }}
          whileInView='visible'
        >
          Pay once. Keep everything you generate.
        </motion.p>
        <div className='grid gap-6 md:grid-cols-2 mt-8 max-w-4xl mx-auto'>
          <motion.div
            initial='hidden'
            variants={fadeUp}
            viewport={{ once: true }}
            whileInView='visible'
          >
            <Card className='bg-content1/60 border border-default-100 h-full'>
              <CardHeader className='pb-4'>
                <div className='w-full'>
                  <div className='flex items-center justify-between mb-2'>
                    <div className='text-xl font-semibold'>Starter</div>
                    <div className='text-3xl font-bold'>$12</div>
                  </div>
                  <p className='text-default-500 text-sm'>
                    Perfect for personal use
                  </p>
                </div>
              </CardHeader>
              <CardBody className='pt-0'>
                <div className='space-y-6'>
                  <div>
                    <h4 className='font-medium mb-3'>What&apos;s included:</h4>
                    <ul className='space-y-2 text-sm'>
                      <li className='flex items-center gap-2'>
                        <span className='text-primary'>✓</span>
                        <span>20 high-quality images</span>
                      </li>
                      <li className='flex items-center gap-2'>
                        <span className='text-primary'>✓</span>
                        <span>High consistency model</span>
                      </li>
                      <li className='flex items-center gap-2'>
                        <span className='text-primary'>✓</span>
                        <span>All style categories</span>
                      </li>
                      <li className='flex items-center gap-2'>
                        <span className='text-primary'>✓</span>
                        <span>Commercial use license</span>
                      </li>
                      <li className='flex items-center gap-2'>
                        <span className='text-primary'>✓</span>
                        <span>Instant download</span>
                      </li>
                      <li className='flex items-center gap-2'>
                        <span className='text-primary'>✓</span>
                        <span>No watermarks</span>
                      </li>
                    </ul>
                  </div>
                  <div className='pt-2'>
                    <div className='text-xs text-default-500 mb-4'>
                      $0.60 per image • One-time payment
                    </div>
                    <Button
                      className='w-full'
                      color='primary'
                      isLoading={loadingPlan === 'STARTER'}
                      size='lg'
                      variant='flat'
                      onPress={() => handlePurchase('STARTER')}
                    >
                      Choose Starter
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
          <motion.div
            initial='hidden'
            variants={fadeUp}
            viewport={{ once: true }}
            whileInView='visible'
          >
            <Card className='bg-content1/60 border-2 border-primary/40 h-full relative overflow-visible'>
              {/* Popular badge - inclined corner ribbon */}
              <div className='absolute -top-3 -right-3 transform rotate-12 z-10'>
                <div className='bg-gradient-to-r from-primary to-secondary text-white px-5 py-2 text-sm font-bold shadow-xl rounded-sm'>
                  Most Popular
                </div>
              </div>
              <CardHeader className='pb-4 pt-6'>
                <div className='w-full'>
                  <div className='flex items-center justify-between mb-2'>
                    <div className='text-xl font-semibold'>Creator</div>
                    <div className='text-3xl font-bold'>$20</div>
                  </div>
                  <p className='text-default-500 text-sm'>
                    Best value for content creators
                  </p>
                </div>
              </CardHeader>
              <CardBody className='pt-0'>
                <div className='space-y-6'>
                  <div>
                    <h4 className='font-medium mb-3'>
                      Everything in Starter, plus:
                    </h4>
                    <ul className='space-y-2 text-sm'>
                      <li className='flex items-center gap-2'>
                        <span className='text-primary'>✓</span>
                        <span className='font-medium'>
                          40 high-quality images
                        </span>
                      </li>
                      <li className='flex items-center gap-2'>
                        <span className='text-primary'>✓</span>
                        <span>Priority generation queue</span>
                      </li>
                      <li className='flex items-center gap-2'>
                        <span className='text-primary'>✓</span>
                        <span>Bulk download (ZIP file)</span>
                      </li>
                      <li className='flex items-center gap-2'>
                        <span className='text-primary'>✓</span>
                        <span>Premium support</span>
                      </li>
                      <li className='flex items-center gap-2'>
                        <span className='text-primary'>✓</span>
                        <span>Early access to new features</span>
                      </li>
                      <li className='flex items-center gap-2'>
                        <span className='text-success'>✓</span>
                        <span className='font-medium text-success'>
                          50% more value
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className='pt-2'>
                    <div className='text-xs text-default-500 mb-4'>
                      $0.50 per image • One-time payment
                    </div>
                    <Button
                      className='w-full'
                      color='primary'
                      isLoading={loadingPlan === 'CREATOR'}
                      size='lg'
                      variant='shadow'
                      onPress={() => handlePurchase('CREATOR')}
                    >
                      Choose Creator
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </div>

      {error && <ErrorToast message={error} onClose={() => setError(null)} />}
    </section>
  );
}

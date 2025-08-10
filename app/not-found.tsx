'use client';

import { Button } from '@heroui/button';
import { Card, CardBody } from '@heroui/card';
import { Link } from '@heroui/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-background to-default-50 flex items-center justify-center p-4'>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className='w-full max-w-md'
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <Card className='bg-content1/80 backdrop-blur-sm border border-default-200 shadow-xl'>
          <CardBody className='p-8 text-center'>
            <motion.div
              animate={{ scale: 1 }}
              className='text-6xl mb-4'
              initial={{ scale: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              🔍
            </motion.div>

            <motion.h1
              animate={{ opacity: 1 }}
              className='text-3xl font-bold text-foreground mb-2'
              initial={{ opacity: 0 }}
              transition={{ delay: 0.3 }}
            >
              404
            </motion.h1>

            <motion.h2
              animate={{ opacity: 1 }}
              className='text-xl font-semibold text-default-700 mb-2'
              initial={{ opacity: 0 }}
              transition={{ delay: 0.4 }}
            >
              Page Not Found
            </motion.h2>

            <motion.p
              animate={{ opacity: 1 }}
              className='text-default-600 mb-6 text-sm leading-relaxed'
              initial={{ opacity: 0 }}
              transition={{ delay: 0.5 }}
            >
              The page you&apos;re looking for doesn&apos;t exist or has been
              moved.
            </motion.p>

            <motion.div
              animate={{ opacity: 1 }}
              className='space-y-3'
              initial={{ opacity: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                as={Link}
                className='w-full'
                color='primary'
                href='/'
                size='lg'
              >
                Go to Homepage
              </Button>

              <Button
                as={Link}
                className='w-full'
                color='default'
                href='/dashboard'
                size='sm'
                variant='light'
              >
                Go to Dashboard
              </Button>
            </motion.div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}

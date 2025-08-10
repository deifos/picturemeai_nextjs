import type { Viewport } from 'next';

import React from 'react';
import { Card, CardBody } from '@heroui/card';
import { Link } from '@heroui/link';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

const PrivacyPolicy: React.FC = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <main className='flex-grow container mx-auto px-6 py-16 max-w-4xl'>
        <Card className='bg-content1/60 border border-default-100'>
          <CardBody className='p-8'>
            <h1 className='text-4xl font-bold mb-6 text-foreground'>
              Privacy Policy for PictureMe AI
            </h1>

            <p className='mb-6 text-default-600 text-lg'>
              This Privacy Policy describes how PictureMe AI collects, uses, and
              protects your information when you use our AI-powered image
              generation service.
            </p>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              1. Information We Collect
            </h2>
            <h3 className='text-lg font-semibold mb-3 text-foreground'>
              Personal Information
            </h3>
            <p className='mb-4 text-default-600'>
              When you create an account, we collect:
            </p>
            <ul className='list-disc pl-8 mb-6 text-default-600 space-y-2'>
              <li>Email address for account creation and communication</li>
              <li>Name (if provided) for personalization</li>
              <li>Payment information (processed securely through Stripe)</li>
            </ul>

            <h3 className='text-lg font-semibold mb-3 text-foreground'>
              Image Data
            </h3>
            <p className='mb-6 text-default-600'>
              We temporarily process the portrait images you upload to generate
              styled variations. Your original images are used solely for the AI
              generation process.
            </p>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              2. How We Use Your Information
            </h2>
            <p className='mb-4 text-default-600'>We use your information to:</p>
            <ul className='list-disc pl-8 mb-6 text-default-600 space-y-2'>
              <li>Provide AI image generation services</li>
              <li>Process payments and manage your account</li>
              <li>Improve our AI models and service quality</li>
              <li>Send important service updates and notifications</li>
              <li>Provide customer support</li>
            </ul>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              3. Image Processing and Storage
            </h2>
            <p className='mb-4 text-default-600'>
              Your uploaded images are processed through our third-party AI
              service provider{' '}
              <Link
                isExternal
                showAnchorIcon
                className='text-primary hover:text-primary/80'
                href='https://fal.ai'
              >
                Fal.ai
              </Link>
              . We ensure that:
            </p>
            <ul className='list-disc pl-8 mb-6 text-default-600 space-y-2'>
              <li>Images are processed securely and temporarily</li>
              <li>Generated images are stored for your account access</li>
              <li>We do not use your images for marketing or other purposes</li>
              <li>You can delete your generated images at any time</li>
            </ul>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              4. Data Sharing and Third Parties
            </h2>
            <p className='mb-4 text-default-600'>
              We work with trusted third-party services:
            </p>
            <ul className='list-disc pl-8 mb-6 text-default-600 space-y-2'>
              <li>
                <strong>Fal.ai</strong> - AI image processing (subject to their
                privacy policy)
              </li>
              <li>
                <strong>Stripe</strong> - Payment processing (subject to their
                privacy policy)
              </li>
              <li>
                <strong>Vercel</strong> - Hosting and infrastructure
              </li>
            </ul>
            <p className='mb-6 text-default-600'>
              We do not sell, rent, or share your personal information with
              third parties for marketing purposes.
            </p>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              5. Data Security
            </h2>
            <p className='mb-6 text-default-600'>
              We implement appropriate security measures to protect your
              information:
            </p>
            <ul className='list-disc pl-8 mb-6 text-default-600 space-y-2'>
              <li>Encrypted data transmission (HTTPS)</li>
              <li>Secure authentication systems</li>
              <li>Regular security updates and monitoring</li>
              <li>
                Limited access to personal data by authorized personnel only
              </li>
            </ul>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              6. Your Rights and Choices
            </h2>
            <p className='mb-4 text-default-600'>You have the right to:</p>
            <ul className='list-disc pl-8 mb-6 text-default-600 space-y-2'>
              <li>Access your personal information</li>
              <li>Update or correct your account information</li>
              <li>Delete your account and associated data</li>
              <li>Download your generated images</li>
              <li>Opt out of non-essential communications</li>
            </ul>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              7. Data Retention
            </h2>
            <p className='mb-6 text-default-600'>
              We retain your data as follows:
            </p>
            <ul className='list-disc pl-8 mb-6 text-default-600 space-y-2'>
              <li>Account information: Until you delete your account</li>
              <li>Generated images: Until you delete them or your account</li>
              <li>
                Payment records: As required by law and for accounting purposes
              </li>
              <li>
                Usage logs: Anonymized and aggregated for service improvement
              </li>
            </ul>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              8. Children&apos;s Privacy
            </h2>
            <p className='mb-6 text-default-600'>
              PictureMe AI is not intended for children under 13 years of age.
              We do not knowingly collect personal information from children
              under 13.
            </p>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              9. Changes to This Policy
            </h2>
            <p className='mb-6 text-default-600'>
              We may update this Privacy Policy from time to time. We will
              notify you of any material changes by posting the new policy on
              this page and updating the &quot;Last updated&quot; date.
            </p>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              10. Contact Us
            </h2>
            <p className='mb-6 text-default-600'>
              If you have any questions about this Privacy Policy or our data
              practices, please contact us through our support channels.
            </p>

            <p className='mt-8 text-sm text-default-500 border-t border-default-200 pt-6'>
              Last updated: December 2024
            </p>
          </CardBody>
        </Card>
      </main>
    </div>
  );
};

export default PrivacyPolicy;

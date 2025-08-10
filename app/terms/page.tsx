import type { Viewport } from 'next';

import React from 'react';
import { Card, CardBody } from '@heroui/card';
import { Link } from '@heroui/link';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

const TermsAndConditions: React.FC = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <main className='flex-grow container mx-auto px-6 py-16 max-w-4xl'>
        <Card className='bg-content1/60 border border-default-100'>
          <CardBody className='p-8'>
            <h1 className='text-4xl font-bold mb-6 text-foreground'>
              Terms and Conditions for PictureMe AI
            </h1>

            <p className='mb-6 text-default-600 text-lg'>
              By using PictureMe AI, you agree to comply with and be bound by
              the following terms and conditions. Please read these terms
              carefully before using our platform.
            </p>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              1. Acceptance of Terms
            </h2>
            <p className='mb-6 text-default-600'>
              By accessing or using PictureMe AI, you agree to be bound by these
              Terms and Conditions and all applicable laws and regulations. If
              you do not agree with any part of these terms, you may not use our
              services.
            </p>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              2. Use of the Platform
            </h2>
            <p className='mb-6 text-default-600'>
              PictureMe AI provides AI-powered image generation and
              transformation services for creating professional portraits and
              styled images. Our service utilizes third-party AI models from{' '}
              <Link
                isExternal
                showAnchorIcon
                className='text-primary hover:text-primary/80'
                href='https://fal.ai'
              >
                Fal.ai
              </Link>
              . By using our service, you also agree to their respective terms
              of service.
            </p>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              3. User Responsibilities
            </h2>
            <p className='mb-4 text-default-600'>
              When using PictureMe AI, you agree to:
            </p>
            <ul className='list-disc pl-8 mb-6 text-default-600 space-y-2'>
              <li>Only upload images that you own or have the rights to use</li>
              <li>
                Not upload any content that is illegal, inappropriate, or
                violates others&apos; rights
              </li>
              <li>
                Not attempt to circumvent any technical limitations or security
                measures
              </li>
              <li>
                Not use the service for any illegal or unauthorized purpose
              </li>
              <li>
                Only upload clear portrait photos of yourself for generation
              </li>
            </ul>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              4. Content Guidelines
            </h2>
            <p className='mb-4 text-default-600'>
              Users must ensure that all uploaded content:
            </p>
            <ul className='list-disc pl-8 mb-6 text-default-600 space-y-2'>
              <li>Is not pornographic or sexually explicit</li>
              <li>Does not promote violence or hate speech</li>
              <li>Does not infringe on any intellectual property rights</li>
              <li>Is not intended to harass or bully others</li>
              <li>Contains only your own face and likeness</li>
            </ul>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              5. Generated Content and Ownership
            </h2>
            <p className='mb-6 text-default-600'>
              By using our AI image generation tools, you acknowledge that the
              generated images are created based on your input and our AI
              models. You retain ownership of the generated images for personal
              and commercial use. We do not guarantee the uniqueness or
              originality of generated content.
            </p>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              6. Credit System and Purchases
            </h2>
            <p className='mb-4 text-default-600'>
              PictureMe AI operates on a credit-based system:
            </p>
            <ul className='list-disc pl-8 mb-6 text-default-600 space-y-2'>
              <li>Each image generation consumes 1 credit</li>
              <li>
                Credits are purchased through our Starter (20 credits for $12)
                or Creator (40 credits for $20) packages
              </li>
              <li>All purchases are final and non-refundable</li>
              <li>Credits do not expire</li>
              <li>
                Creator package users receive additional features including bulk
                download capabilities
              </li>
            </ul>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              7. Limitation of Liability
            </h2>
            <p className='mb-6 text-default-600'>
              We shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages resulting from your use of or
              inability to use PictureMe AI. The platform is provided on an
              &quot;as-is&quot; basis, and we make no warranties regarding its
              performance or results.
            </p>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              8. Data and Privacy
            </h2>
            <p className='mb-6 text-default-600'>
              Your uploaded images and generated content are processed securely
              and are not shared with third parties for marketing purposes.
              Please refer to our Privacy Policy for detailed information about
              data handling.
            </p>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              9. Changes to Terms
            </h2>
            <p className='mb-6 text-default-600'>
              We reserve the right to modify these terms at any time. Your
              continued use of PictureMe AI after changes are posted constitutes
              your acceptance of the modified terms.
            </p>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              10. Governing Law
            </h2>
            <p className='mb-6 text-default-600'>
              These Terms and Conditions shall be governed by and construed in
              accordance with the laws of the United States, without regard to
              its conflict of law provisions.
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

export default TermsAndConditions;

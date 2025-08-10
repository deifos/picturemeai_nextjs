'use client';

import { Accordion, AccordionItem } from '@heroui/accordion';
import { motion, Variants } from 'framer-motion';
import { Link } from '@heroui/link';

import { title } from '@/components/primitives';
import { XIcon } from '@/components/icons';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export function FAQ() {
  const faqData = [
    {
      key: 'refund-policy',
      title: 'Why are there no refunds after image generation?',
      content:
        "Once images are generated, we cannot offer refunds because running AI models incurs real computational costs that cannot be recovered. Each generation uses expensive GPU processing power through our AI providers. However, we're confident in our service quality and offer sample images on our website so you can see the expected results before purchasing.",
    },
    {
      key: 'ai-mistakes',
      title: "What if the AI makes mistakes or the results aren't perfect?",
      content:
        "AI image generation can sometimes produce unexpected results. Most issues can be improved by refining your prompt or trying a different style category. We recommend being specific about what you want (e.g., 'professional business headshot with natural lighting' instead of just 'professional photo'). If you're not satisfied with a generation, try adjusting your prompt and generating again.",
    },
    {
      key: 'image-storage',
      title: 'How long are my images stored? Do I need to download them?',
      content:
        'Generated images are automatically deleted from our servers after 48 hours for privacy and storage management. We strongly recommend downloading all your images immediately after generation. You can download individual images or use the bulk download feature (available for Creator package users) to get all your images in a ZIP file.',
    },
    {
      key: 'image-quality',
      title: 'What image quality can I expect?',
      content:
        'All generated images are high-resolution and suitable for professional use, including LinkedIn profiles, business websites, marketing materials, and print applications. We use state-of-the-art AI models that produce sharp, detailed images with natural lighting and professional quality that rivals traditional photography.',
    },
    {
      key: 'upload-requirements',
      title: 'What kind of photo should I upload for best results?',
      content:
        "Upload a clear, well-lit photo of yourself facing the camera. The best results come from: high-resolution images (at least 512x512px), good lighting with your face clearly visible, minimal background distractions, and photos where you're looking directly at the camera. Selfies and professional headshots both work well.",
    },
    {
      key: 'commercial-use',
      title: 'Can I use the generated images commercially?',
      content:
        'Yes! You have full commercial rights to all generated images. You can use them for business websites, LinkedIn profiles, marketing materials, social media, printed materials, and any other commercial purposes. The images are yours to use without any additional licensing fees or attribution requirements.',
    },
    {
      key: 'credit-system',
      title: 'How does the credit system work?',
      content:
        "Each image generation uses 1 credit, regardless of style or category. Credits don't expire, so you can use them whenever you want. We offer two packages: Starter (20 credits for $12) and Creator (40 credits for $20). Creator package users also get priority generation and bulk download features.",
    },
    {
      key: 'generation-time',
      title: 'How long does it take to generate images?',
      content:
        'Most images are generated within 30-60 seconds. Generation time can vary based on server load and the complexity of your request. Creator package users get priority processing, which means faster generation times during peak usage periods.',
    },
    {
      key: 'privacy-security',
      title: 'Is my uploaded photo secure and private?',
      content:
        "Yes, we take privacy seriously. Your uploaded photos are processed securely and used only for generating your requested images. We don't store your original photos longer than necessary for processing, and we never use your images for marketing or training purposes. All generated images are automatically deleted after 48 hours.",
    },
    {
      key: 'styles-categories',
      title: 'What styles and categories are available?',
      content:
        'We offer multiple style categories including Professional, Lifestyle, Travel, Fitness, Fashion/Modeling, Creative/Fantasy, Cinematic, Retro, Trendy/Viral, and Minimal Studio. Each category contains 10+ different prompt variations. You can also choose from three rendering styles: Auto (balanced), Realistic (photographic), and Fiction (artistic).',
    },
  ];

  return (
    <section
      className='w-full min-h-screen snap-start flex items-center'
      id='faq'
    >
      <div className='container mx-auto max-w-4xl px-6 py-16'>
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
          Frequently Asked Questions
        </motion.h2>
        <motion.p
          className='text-center text-default-600 text-lg mt-4 mb-12'
          initial='hidden'
          variants={fadeUp}
          viewport={{ once: true }}
          whileInView='visible'
        >
          Everything you need to know about PictureMe AI
        </motion.p>

        <motion.div
          initial='hidden'
          variants={fadeUp}
          viewport={{ once: true }}
          whileInView='visible'
        >
          <Accordion className='gap-4' variant='splitted'>
            {faqData.map(faq => (
              <AccordionItem
                key={faq.key}
                aria-label={faq.title}
                className='bg-content1/60 border border-default-100 px-6 py-2'
                classNames={{
                  title: 'text-lg font-semibold text-foreground',
                  content: 'text-default-600 leading-relaxed pb-4',
                }}
                title={faq.title}
              >
                {faq.content}
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Contact section */}
        <motion.div
          className='mt-12 text-center'
          initial='hidden'
          variants={fadeUp}
          viewport={{ once: true }}
          whileInView='visible'
        >
          <div className='bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20'>
            <h3 className='text-xl font-semibold mb-2'>
              Still have questions?
            </h3>
            <p className='text-default-600 mb-4'>
              Can&apos;t find what you&apos;re looking for? Reach out to me on{' '}
              <Link isExternal href='https://x.com/deifosv'>
                {' '}
                <XIcon className='w-4 h-4' />
              </Link>{' '}
              or through the feedback bubble.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

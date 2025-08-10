export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'PictureMe AI',
  description:
    'Upload one photo, get dozens of studio‑quality shots of yourself in any setting — fast, consistent, and private.',
  navItems: [
    {
      label: 'Features',
      href: '/#features',
    },
    {
      label: 'How it works',
      href: '/#how-it-works',
    },
    {
      label: 'Pricing',
      href: '/#pricing',
    },
  ],
  navMenuItems: [
    {
      label: 'Features',
      href: '/#features',
    },
    {
      label: 'How it works',
      href: '/#how-it-works',
    },
    {
      label: 'Pricing',
      href: '/#pricing',
    },
    {
      label: 'Dashboard',
      href: '/dashboard',
    },
  ],
  links: {
    github: '#',
    twitter: '#',
    docs: '/docs',
    discord: '#',
    sponsor: '#',
  },
};

/**
 * Application Configuration
 *
 * Centralized configuration for PictureMe AI application.
 * All hardcoded values should be defined here for easy maintenance.
 */

// Credits and Pricing Configuration
export const CREDITS_CONFIG = {
  // Cost per image generation
  COST_PER_GENERATION: 1,

  // Free credits for new users
  FREE_CREDITS_PER_USER: 1,

  // Default generation settings
  DEFAULT_NUM_IMAGES: 1,
  DEFAULT_IMAGE_SIZE: 'square_hd' as const,
  DEFAULT_STYLE: 'AUTO' as const,
  DEFAULT_RENDERING_SPEED: 'BALANCED' as const,

  // Credit packages (prices in cents)
  PACKAGES: {
    STARTER: {
      credits: 20,
      price: 1200, // $12.00
      pricePerImage: 0.6,
    },
    CREATOR: {
      credits: 40,
      price: 2000, // $20.00
      pricePerImage: 0.5,
    },
  },
} as const;

// API Configuration
export const API_CONFIG = {
  // Internal API endpoints
  ENDPOINTS: {
    FAL_PROXY: '/api/fal/proxy',
    RECORD_GENERATION: '/api/record-generation',
    USER_CREDITS: '/api/user/credits',
    USER_GENERATIONS: '/api/user/generations',
    STRIPE_CHECKOUT: '/api/stripe/create-checkout-session',
    AUTH_RESEND_VERIFICATION: '/api/auth/resend-verification',
  },

  // External services
  EXTERNAL: {
    FAL_AI_URL: 'https://fal.ai',
    TWITTER_URL: 'https://x.com/deifosv',
    FEEDBACK_WIDGET_URL:
      'https://www.feedbackbasket.com/api/widget/script/cme3q0an50001jm04d6extjp1',
  },
} as const;

// UI Configuration
export const UI_CONFIG = {
  // Loading states
  LOADING_SKELETONS: 6,

  // Gallery settings
  GRID_COLUMNS: {
    mobile: 1,
    tablet: 2,
    desktop: 3,
  },
} as const;

// Business Configuration
export const BUSINESS_CONFIG = {
  // Company information
  COMPANY_NAME: 'PictureMe AI',
  SUPPORT_EMAIL: 'support@PictureMe AI.com',
  NOREPLY_EMAIL: 'noreply@picturemeai.com',

  // Branding
  TAGLINES: {
    MAIN: 'AI-Powered Professional Headshots',
    PRICING: 'One-time payment • No subscriptions',
  },

  // Legal
  REFUND_POLICY: 'No refunds due to computational costs',
  TERMS_VERSION: '2024-01-01',
} as const;

// Development Configuration
export const DEV_CONFIG = {
  // Default values for development
  DEFAULT_APP_URL: 'http://localhost:3000',

  // Debug settings
  ENABLE_CONSOLE_LOGS: process.env.NODE_ENV === 'development',
} as const;

// Export all configs as a single object for convenience
export const APP_CONFIG = {
  CREDITS: CREDITS_CONFIG,
  API: API_CONFIG,
  UI: UI_CONFIG,
  BUSINESS: BUSINESS_CONFIG,
  DEV: DEV_CONFIG,
} as const;

// Type exports for better TypeScript support
export type CreditsPackage = keyof typeof CREDITS_CONFIG.PACKAGES;
export type ApiEndpoint = keyof typeof API_CONFIG.ENDPOINTS;

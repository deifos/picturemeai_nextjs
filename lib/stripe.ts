import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-10-29.clover',
  typescript: true,
});

// Product configurations
export const STRIPE_PRODUCTS = {
  STARTER: {
    name: 'Starter',
    credits: 20,
    price: 1200, // $12.00 in cents
    priceId: process.env.STRIPE_STARTER_PRICE_ID!,
    productId: process.env.STRIPE_STARTER_PRODUCT_ID!,
  },
  CREATOR: {
    name: 'Creator',
    credits: 40,
    price: 2000, // $20.00 in cents
    priceId: process.env.STRIPE_CREATOR_PRICE_ID!,
    productId: process.env.STRIPE_CREATOR_PRODUCT_ID!,
  },
} as const;

export type ProductType = keyof typeof STRIPE_PRODUCTS;

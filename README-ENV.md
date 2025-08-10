# Environment Variables Setup

Add these variables to your `.env.local` file:

## Database

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/picturemai"
DIRECT_URL="postgresql://username:password@localhost:5432/picturemai"
```

## Better Auth

```bash
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"
```

## App

```bash
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## FAL AI

```bash
FAL_KEY="your-fal-api-key"
```

## Google OAuth

```bash
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Stripe

```bash
# Server-side keys (keep secret)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Client-side publishable key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Product Price IDs (client-side accessible)
NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID="price_..."
NEXT_PUBLIC_STRIPE_CREATOR_PRICE_ID="price_..."
```

## Stripe Setup Steps:

1. Create products in Stripe dashboard:
   - **Starter**: $12.00 for 20 credits
   - **Creator**: $20.00 for 40 credits
2. Copy the price IDs to your environment variables
3. Set up webhook endpoint: `{your-domain}/api/stripe/webhook`
4. Add webhook secret to environment variables

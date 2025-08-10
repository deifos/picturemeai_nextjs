# PictureMe AI

**AI-Powered Professional Headshots** - Generate stunning professional headshots from your photos using cutting-edge AI technology.

### Features

- 🖼️ **AI Image Generation** - Transform personal photos into professional headshots using [FAL.AI](https://fal.ai)
- 🆓 **Free Trial** - New users get 1 free image generation (no credit card required)
- 💳 **Credit-Based System** - Pay-per-use model with two convenient packages
- 🎨 **Multiple Styles** - Choose from Auto, Realistic, or Fiction styles
- 🔐 **Secure Authentication** - Google OAuth and email/password with Better Auth
- 💰 **Stripe Integration** - Secure payment processing

### Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) with App Router
- **UI Components**: [HeroUI](https://heroui.com)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Database**: PostgreSQL with [Prisma ORM](https://prisma.io)
- **Authentication**: [Better Auth](https://better-auth.com)
- **AI Generation**: [FAL.AI](https://fal.ai) (Ideogram Character model)
- **Payments**: [Stripe](https://stripe.com)
- **Email**: [ZeptoMail](https://zeptomail.com)
- **Hosting**: [Supabase](https://supabase.com) (Database) You can host anywhere with Postgres

### Quick Start

**1. Clone & Install**

\`\`\`bash
git clone https://github.com/your-username/picturemeai-nextjs.git
cd picturemeai-nextjs
npm install

````

**2. Environment Setup**

Copy the environment template and configure with your API keys:

```bash
cp .env.example .env.local
````

Edit `.env.local` with your actual API keys and configuration values. See `.env.example` for all required variables.

**3. Database Setup**

```bash
npx prisma generate
npx prisma db push
```

**4. Run Development Server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Project Structure

\`\`\`
├── app/ # Next.js 15 App Router
│ ├── api/ # API routes
│ │ ├── auth/ # Authentication endpoints
│ │ ├── fal/ # FAL.AI proxy
│ │ ├── record-generation/ # Generation tracking
│ │ ├── stripe/ # Payment processing
│ │ └── user/ # User data endpoints
│ ├── auth/ # Authentication pages
│ ├── dashboard/ # Main dashboard
│ └── (marketing)/ # Landing pages
├── components/ # Reusable UI components
│ ├── auth/ # Authentication forms
│ ├── dashboard/ # Dashboard components
│ ├── icons/ # SVG icon components
│ └── landing/ # Marketing page components
├── config/ # Application configuration
│ └── app-config.ts # Centralized app settings
├── lib/ # Utilities and clients
│ ├── auth-client.ts # Authentication client
│ ├── credits-store.ts # Credit management
│ ├── fal-client.ts # FAL.AI integration
│ └── stripe.ts # Payment configuration
└── prisma/ # Database schema and migrations

````

## 💰 Pricing Configuration

The app uses a credit-based system with a free trial for new users, configured in `config/app-config.ts`:

```typescript
CREDITS_CONFIG: {
  // Free trial for new users
  FREE_CREDITS_PER_USER: 1,

  // Paid packages
  PACKAGES: {
    STARTER: {
      credits: 20,
      price: 1200, // $12.00 in cents
      pricePerImage: 0.60,
    },
    CREATOR: {
      credits: 40,
      price: 2000, // $20.00 in cents
      pricePerImage: 0.50,
    },
  }
}
````

### Credit System

- **Free Trial**: New users get **1 free image generation** (no credit card required)
- **Credit Cost**: Each image generation costs **1 credit**
- **Credit Priority**: Free credits are used first, then paid credits
- **Expiration**: Credits never expire
- **Payment Model**: One-time payment (no subscriptions)

### Free Credit Configuration

To modify the number of free credits per user, update `FREE_CREDITS_PER_USER` in `config/app-config.ts`. The system automatically:

- Tracks free credit usage in the database (`freeCreditsUsed` field)
- Prioritizes free credits over paid credits during generation
- Shows clear breakdown in the UI ("1 free" vs "20 paid")
- Seamlessly transitions to paid credits when free credits are exhausted

### Deployment

**Vercel (Recommended)**

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

> **Note**: The `postinstall` script automatically runs `prisma generate` during deployment to ensure the Prisma client is available.

**Stripe Webhook Setup**

**Important**: Configure webhooks in your Stripe Dashboard for payments to work:

1. Go to **Developers** → **Webhooks** in Stripe Dashboard
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Enable these **3 required events**:
   - ✅ `checkout.session.completed` (Essential - assigns credits to user)
   - ✅ `payment_intent.succeeded` (Confirms successful payments)
   - ✅ `payment_intent.payment_failed` (Handles failed payments)
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET` in your environment

> **Note**: Without these webhooks, users won't receive credits after payment!

### Environment Variables for Production

**CRITICAL**: Update these for production deployment to avoid "State not found" OAuth errors:

\`\`\`env

### Authentication URLs - MUST match your production domain

NEXT_PUBLIC_APP_URL=https://yourdomain.com
BETTER_AUTH_URL=https://yourdomain.com

### Email configuration

EMAIL_FROM=noreply@yourdomain.com

### Generate new secrets for production

BETTER_AUTH_SECRET=your_secure_production_secret
\`\`\`

### Google OAuth Setup (Production)

**Required** for Google sign-in to work in production:

1. **Google Cloud Console Setup**:

   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Navigate to **APIs & Credentials** → **Credentials**
   - Find your OAuth 2.0 Client ID

2. **Update Authorized Origins**:

   - Add your production domain: \`https://yourdomain.com\`
   - Keep \`http://localhost:3000\` for local development

3. **Update Authorized Redirect URIs**:

   - Add: \`https://yourdomain.com/api/auth/callback/google\`
   - Keep: \`http://localhost:3000/api/auth/callback/google\` for local development

4. **Environment Variables**:
   - Use the same \`GOOGLE_CLIENT_ID\` and \`GOOGLE_CLIENT_SECRET\` for both environments
   - The OAuth redirect URLs will automatically resolve based on your \`NEXT_PUBLIC_APP_URL\`

> **⚠️ Important**: If you don't update the authorized origins and redirect URIs in Google Cloud Console, users will get "Error 400: redirect_uri_mismatch" when trying to sign in with Google in production.

## 🧪 Development

### Available Scripts

\`\`\`bash
npm run dev # Start development server
npm run build # Build for production
npm run start # Start production server
npm run lint # Run ESLint
npm run format # Format code with Prettier
\`\`\`

### Code Quality

- **ESLint**: Configured with Next.js, React, and TypeScript rules
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict type checking enabled
- **Husky**: Pre-commit hooks (if configured)

### License

This project is licensed under the MIT License.

### Acknowledgments

- **[FAL.AI](https://fal.ai)** - AI image generation platform
- **[HeroUI](https://heroui.com)** - Beautiful React components
- **[Better Auth](https://better-auth.com)** - Authentication solution
- **[Vercel](https://vercel.com)** - Deployment platform

---

Built with 🔨 💛 by [Vlad](https://x.com/deifosv)

# 🎯 PictureMe AI

**AI-Powered Professional Headshots** - Generate stunning professional headshots from your photos using cutting-edge AI technology.

## ✨ Features

- 🖼️ **AI Image Generation** - Transform personal photos into professional headshots using [FAL.AI](https://fal.ai)
- 🆓 **Free Trial** - New users get 1 free image generation (no credit card required)
- 💳 **Credit-Based System** - Pay-per-use model with two convenient packages
- 🎨 **Multiple Styles** - Choose from Auto, Realistic, or Fiction styles
- 📐 **Various Formats** - Portrait, Square, and Landscape orientations
- 🔐 **Secure Authentication** - Google OAuth and email/password with Better Auth
- 💰 **Stripe Integration** - Secure payment processing
- 📧 **Email Notifications** - Account verification and password reset emails
- 📱 **Responsive Design** - Works beautifully on all devices
- ⚡ **Fast Generation** - Direct FAL.AI integration for optimal performance

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) with App Router
- **UI Components**: [HeroUI](https://heroui.com)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Database**: PostgreSQL with [Prisma ORM](https://prisma.io)
- **Authentication**: [Better Auth](https://better-auth.com)
- **AI Generation**: [FAL.AI](https://fal.ai) (Ideogram Character model)
- **Payments**: [Stripe](https://stripe.com)
- **Email**: [ZeptoMail](https://zeptomail.com)
- **Hosting**: [Supabase](https://supabase.com) (Database)

## 🚀 Quick Start

### 1. Clone & Install

\`\`\`bash
git clone https://github.com/your-username/picturemeai-nextjs.git
cd picturemeai-nextjs
npm install
\`\`\`

### 2. Environment Setup

Copy the environment variables and configure with your API keys:

\`\`\`bash
cp .env .env.local
\`\`\`

Required environment variables:

\`\`\`env

# AI Generation - Get your key from https://fal.ai

FAL_KEY=your_fal_api_key

# Database - Supabase or any PostgreSQL database

DATABASE_URL=your_postgresql_connection_string
DIRECT_URL=your_direct_postgresql_connection_string

# Authentication - Better Auth configuration

BETTER_AUTH_SECRET=your_random_secret_key
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# Google OAuth (optional)

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Stripe Payment Processing

STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID=price_your_starter_price_id
NEXT_PUBLIC_STRIPE_CREATOR_PRICE_ID=price_your_creator_price_id

# Required Stripe Webhook Events (configure in Stripe Dashboard):

# - checkout.session.completed

# - payment_intent.succeeded

# - payment_intent.payment_failed

# Email Service - ZeptoMail configuration

EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=YourAppName
ZEPTOMAIL_API_URL=api.zeptomail.com/
ZEPTO_MAIL_API_KEY=your_zeptomail_api_key
\`\`\`

### 3. Database Setup

\`\`\`bash

# Generate Prisma client

npx prisma generate

# Run database migrations

npx prisma db push

# (Optional) Seed the database

npx prisma db seed
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

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

## 🔧 Configuration

All hardcoded values are centralized in `config/app-config.ts`:

- **Credit costs and pricing**
- **API endpoints**
- **Default generation settings**
- **Business information**
- **UI constants**

## 🎨 How It Works

1. **Upload**: User uploads a reference photo
2. **Configure**: Choose style (Auto/Realistic/Fiction) and format
3. **Generate**: FAL.AI processes the image using Ideogram Character model
4. **Record**: Backend tracks generation and deducts credits
5. **Download**: User can view and download generated images

### Architecture

- **Frontend** → **FAL.AI**: Direct API calls for fast generation
- **Frontend** → **Backend**: Credit management and generation tracking
- **Backend** → **Database**: Secure record keeping and user management

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

> **Note**: The `postinstall` script automatically runs `prisma generate` during deployment to ensure the Prisma client is available.

### Stripe Webhook Setup

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

Make sure to update these for production:

\`\`\`env
BETTER_AUTH_URL=https://yourdomain.com
NEXT_PUBLIC_BETTER_AUTH_URL=https://yourdomain.com
EMAIL_FROM=noreply@yourdomain.com
\`\`\`

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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 🆘 Support

- **Documentation**: Check this README and code comments
- **Issues**: Create an issue on GitHub
- **Email**: support@yourdomain.com

## 🙏 Acknowledgments

- **[FAL.AI](https://fal.ai)** - AI image generation platform
- **[HeroUI](https://heroui.com)** - Beautiful React components
- **[Better Auth](https://better-auth.com)** - Authentication solution
- **[Vercel](https://vercel.com)** - Deployment platform

---

Built with 🔨 💛 by [Vlad](https://x.com/deifosv)

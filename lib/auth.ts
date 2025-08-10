import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

import prisma from '@/lib/prisma';
import { sendEmail } from '@/app/services/email-service';
import {
  getPasswordResetEmail,
  getVerificationEmail,
} from '@/app/services/auth-email-service';
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      // Extract user name or use email username as fallback
      const name = user.name || user.email.split('@')[0];

      await sendEmail({
        to: user.email,
        subject: 'Reset your password - PicturemeAI',
        html: getPasswordResetEmail(name, url),
      });

      console.log('Password reset email sent successfully');
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      console.log('Email verification triggered for:', user.email);
      console.log('Verification URL:', url);

      // Extract user name or use email username as fallback
      const name = user.name || user.email.split('@')[0];

      await sendEmail({
        to: user.email,
        subject: 'Verify your email - PicturemeAI',
        html: getVerificationEmail(name, url),
      });
    },
  },
  socialProviders: {
    // github: {
    //   clientId: process.env.GITHUB_CLIENT_ID as string,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    // },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});

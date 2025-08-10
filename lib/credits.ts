import prisma from '@/lib/prisma';
import { CREDITS_CONFIG } from '@/config/app-config';

export async function getUserCredits(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { availableCredits: true },
  });

  return user?.availableCredits || 0;
}

/**
 * Get available free credits for a user
 */
export async function getUserFreeCredits(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { freeCreditsUsed: true },
  });

  if (!user) return 0;

  const freeCreditsRemaining =
    CREDITS_CONFIG.FREE_CREDITS_PER_USER - user.freeCreditsUsed;

  return Math.max(0, freeCreditsRemaining);
}

/**
 * Get total available credits (paid + free)
 */
export async function getTotalAvailableCredits(userId: string): Promise<{
  paidCredits: number;
  freeCredits: number;
  total: number;
}> {
  const [paidCredits, freeCredits] = await Promise.all([
    getUserCredits(userId),
    getUserFreeCredits(userId),
  ]);

  return {
    paidCredits,
    freeCredits,
    total: paidCredits + freeCredits,
  };
}

export async function deductCredits(
  userId: string,
  creditsToDeduct: number = 1
): Promise<{ success: boolean; usedFreeCredit: boolean }> {
  try {
    // Use a transaction to prevent race conditions
    const result = await prisma.$transaction(async tx => {
      // Get current user data within the transaction
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: {
          availableCredits: true,
          freeCreditsUsed: true,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Calculate available credits within transaction
      const freeCreditsRemaining = Math.max(
        0,
        CREDITS_CONFIG.FREE_CREDITS_PER_USER - user.freeCreditsUsed
      );
      const totalAvailable = user.availableCredits + freeCreditsRemaining;

      if (totalAvailable < creditsToDeduct) {
        return { success: false, usedFreeCredit: false };
      }

      let usedFreeCredit = false;
      let remainingToDeduct = creditsToDeduct;

      // First, try to use free credits
      if (freeCreditsRemaining > 0 && remainingToDeduct > 0) {
        const freeCreditsToUse = Math.min(
          freeCreditsRemaining,
          remainingToDeduct
        );

        await tx.user.update({
          where: { id: userId },
          data: {
            freeCreditsUsed: {
              increment: freeCreditsToUse,
            },
          },
        });

        remainingToDeduct -= freeCreditsToUse;
        usedFreeCredit = true;
      }

      // Then, use paid credits if needed
      if (remainingToDeduct > 0) {
        // Deduct paid credits from user
        await tx.user.update({
          where: { id: userId },
          data: {
            availableCredits: {
              decrement: remainingToDeduct,
            },
          },
        });

        // Update purchase records (deduct from most recent first)
        const purchases = await tx.purchase.findMany({
          where: {
            userId,
            creditsRemaining: { gt: 0 },
            status: 'COMPLETED',
          },
          orderBy: { createdAt: 'desc' },
        });

        let purchaseDeductRemaining = remainingToDeduct;

        for (const purchase of purchases) {
          if (purchaseDeductRemaining <= 0) break;

          const deductFromThisPurchase = Math.min(
            purchaseDeductRemaining,
            purchase.creditsRemaining
          );

          await tx.purchase.update({
            where: { id: purchase.id },
            data: {
              creditsUsed: {
                increment: deductFromThisPurchase,
              },
              creditsRemaining: {
                decrement: deductFromThisPurchase,
              },
            },
          });

          purchaseDeductRemaining -= deductFromThisPurchase;
        }
      }

      return { success: true, usedFreeCredit };
    });

    return result;
  } catch (error) {
    console.error('Error deducting credits:', error);

    return { success: false, usedFreeCredit: false };
  }
}

export async function recordGeneration({
  userId,
  prompt,
  category,
  numImages,
  imageUrls,
  imageSize,
  style,
  renderingSpeed,
  falRequestId,
  creditsUsed = 1,
  usedFreeCredit = false,
}: {
  userId: string;
  prompt: string;
  category: string;
  numImages: number;
  imageUrls: string[];
  imageSize: string;
  style: string;
  renderingSpeed: string;
  falRequestId?: string;
  creditsUsed?: number;
  usedFreeCredit?: boolean;
}) {
  try {
    const generation = await prisma.generation.create({
      data: {
        userId,
        prompt,
        category,
        numImages,
        imageUrls,
        imageSize,
        style,
        renderingSpeed,
        falRequestId,
        creditsUsed,
        usedFreeCredit,
      },
    });

    return generation;
  } catch (error) {
    console.error('Error recording generation:', error);
    throw error;
  }
}

export async function getUserGenerations(userId: string, limit: number = 50) {
  return prisma.generation.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function getUserPurchases(userId: string) {
  return prisma.purchase.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

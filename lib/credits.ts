import prisma from '@/lib/prisma';

export async function getUserCredits(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { availableCredits: true },
  });

  return user?.availableCredits || 0;
}

export async function deductCredits(
  userId: string,
  creditsToDeduct: number = 1
): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { availableCredits: true },
    });

    if (!user || user.availableCredits < creditsToDeduct) {
      return false; // Insufficient credits
    }

    // Deduct credits from user
    await prisma.user.update({
      where: { id: userId },
      data: {
        availableCredits: {
          decrement: creditsToDeduct,
        },
      },
    });

    // Update purchase records (deduct from most recent first)
    const purchases = await prisma.purchase.findMany({
      where: {
        userId,
        creditsRemaining: { gt: 0 },
        status: 'COMPLETED',
      },
      orderBy: { createdAt: 'desc' },
    });

    let remainingToDeduct = creditsToDeduct;

    for (const purchase of purchases) {
      if (remainingToDeduct <= 0) break;

      const deductFromThisPurchase = Math.min(
        remainingToDeduct,
        purchase.creditsRemaining
      );

      await prisma.purchase.update({
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

      remainingToDeduct -= deductFromThisPurchase;
    }

    return true;
  } catch (error) {
    console.error('Error deducting credits:', error);

    return false;
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

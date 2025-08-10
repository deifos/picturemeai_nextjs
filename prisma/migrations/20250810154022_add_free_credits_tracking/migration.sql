/*
  Warnings:

  - A unique constraint covering the columns `[stripeCustomerId]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "picturemeai"."PurchaseStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- AlterTable
ALTER TABLE "picturemeai"."user" ADD COLUMN     "availableCredits" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "freeCreditsUsed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "stripeCustomerId" TEXT;

-- CreateTable
CREATE TABLE "picturemeai"."purchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeSessionId" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT,
    "stripePriceId" TEXT NOT NULL,
    "stripeProductId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "totalCredits" INTEGER NOT NULL,
    "creditsUsed" INTEGER NOT NULL DEFAULT 0,
    "creditsRemaining" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "status" "picturemeai"."PurchaseStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "picturemeai"."generation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "numImages" INTEGER NOT NULL,
    "imageUrls" TEXT[],
    "imageSize" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "renderingSpeed" TEXT NOT NULL,
    "creditsUsed" INTEGER NOT NULL DEFAULT 1,
    "usedFreeCredit" BOOLEAN NOT NULL DEFAULT false,
    "falRequestId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "generation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "purchase_stripeSessionId_key" ON "picturemeai"."purchase"("stripeSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_stripePaymentIntentId_key" ON "picturemeai"."purchase"("stripePaymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "user_stripeCustomerId_key" ON "picturemeai"."user"("stripeCustomerId");

-- AddForeignKey
ALTER TABLE "picturemeai"."purchase" ADD CONSTRAINT "purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "picturemeai"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "picturemeai"."generation" ADD CONSTRAINT "generation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "picturemeai"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

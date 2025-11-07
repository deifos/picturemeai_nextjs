-- AlterTable
ALTER TABLE "generation" ADD COLUMN     "upscaledImageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[];

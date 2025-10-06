-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "refresh_token_expires_in" INTEGER;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "careerTimeline" TEXT,
ADD COLUMN     "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "onboardingCompletedAt" TIMESTAMP(3),
ADD COLUMN     "preferredLocations" TEXT[],
ADD COLUMN     "targetRole" TEXT,
ADD COLUMN     "willingToRelocate" BOOLEAN NOT NULL DEFAULT false;

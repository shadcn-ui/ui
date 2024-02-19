/*
  Warnings:

  - The values [onboardingToComplete] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `externalId` on the `User` table. All the data in the column will be lost.
  - The required column `onBoardingId` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('emailToConfirm', 'onBoardingToComplete', 'active');
ALTER TABLE "User" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "User" ALTER COLUMN "status" SET DEFAULT 'emailToConfirm';
COMMIT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "externalId",
ADD COLUMN     "onBoardingId" TEXT NOT NULL;

/*
  Warnings:

  - The `status` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('emailToConfirm', 'onBoardingToComplete', 'active');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('pending', 'active', 'expired', 'suspended');

-- CreateEnum
CREATE TYPE "ProductUnit" AS ENUM ('l', 'g');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "status",
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'emailToConfirm';

-- DropEnum
DROP TYPE "Status";

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priceWithoutTax" INTEGER,
    "taxRate" INTEGER,
    "taxAmount" INTEGER,
    "priceWithTax" INTEGER,
    "status" "ProductStatus",
    "currency" "Currency",
    "unit" "ProductUnit",
    "hidden" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

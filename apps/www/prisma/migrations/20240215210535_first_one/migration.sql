-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('euro', 'dollar');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('emailToConfirm', 'onboardingToComplete', 'active');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "currency" "Currency",
    "status" "Status" NOT NULL DEFAULT 'emailToConfirm',
    "externalId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

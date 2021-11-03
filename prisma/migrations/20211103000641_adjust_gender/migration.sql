/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `Gender` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Gender` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Gender" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "externalId" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Gender_externalId_key" ON "Gender"("externalId");

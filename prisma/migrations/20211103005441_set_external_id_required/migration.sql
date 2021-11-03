/*
  Warnings:

  - Made the column `externalId` on table `Gender` required. This step will fail if there are existing NULL values in that column.
  - Made the column `externalId` on table `Genre` required. This step will fail if there are existing NULL values in that column.
  - Made the column `externalId` on table `Person` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Gender" ALTER COLUMN "externalId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Genre" ALTER COLUMN "externalId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Person" ALTER COLUMN "birthday" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "deathday" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "externalId" SET NOT NULL;

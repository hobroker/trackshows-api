/*
  Warnings:

  - The primary key for the `Cast` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Crew` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Cast" DROP CONSTRAINT "Cast_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Cast_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Crew" DROP CONSTRAINT "Crew_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Crew_pkey" PRIMARY KEY ("id");

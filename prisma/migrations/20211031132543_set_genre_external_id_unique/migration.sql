/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `Genre` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Genre_externalId_key" ON "Genre"("externalId");

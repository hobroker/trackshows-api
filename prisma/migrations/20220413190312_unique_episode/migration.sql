/*
  Warnings:

  - A unique constraint covering the columns `[episodeNumber,seasonNumber,watchlistId]` on the table `Episode` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Episode_episodeNumber_seasonNumber_watchlistId_key" ON "Episode"("episodeNumber", "seasonNumber", "watchlistId");

/*
  Warnings:

  - You are about to drop the `GenresOnShows` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KeywordsOnShows` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GenresOnShows" DROP CONSTRAINT "GenresOnShows_genreId_fkey";

-- DropForeignKey
ALTER TABLE "GenresOnShows" DROP CONSTRAINT "GenresOnShows_showId_fkey";

-- DropForeignKey
ALTER TABLE "KeywordsOnShows" DROP CONSTRAINT "KeywordsOnShows_keywordId_fkey";

-- DropForeignKey
ALTER TABLE "KeywordsOnShows" DROP CONSTRAINT "KeywordsOnShows_showId_fkey";

-- DropTable
DROP TABLE "GenresOnShows";

-- DropTable
DROP TABLE "KeywordsOnShows";

-- CreateTable
CREATE TABLE "_GenreToShow" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_KeywordToShow" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GenreToShow_AB_unique" ON "_GenreToShow"("A", "B");

-- CreateIndex
CREATE INDEX "_GenreToShow_B_index" ON "_GenreToShow"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_KeywordToShow_AB_unique" ON "_KeywordToShow"("A", "B");

-- CreateIndex
CREATE INDEX "_KeywordToShow_B_index" ON "_KeywordToShow"("B");

-- AddForeignKey
ALTER TABLE "_GenreToShow" ADD FOREIGN KEY ("A") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenreToShow" ADD FOREIGN KEY ("B") REFERENCES "Show"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KeywordToShow" ADD FOREIGN KEY ("A") REFERENCES "Keyword"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KeywordToShow" ADD FOREIGN KEY ("B") REFERENCES "Show"("id") ON DELETE CASCADE ON UPDATE CASCADE;

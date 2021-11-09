-- CreateTable
CREATE TABLE "Cast" (
    "personId" INTEGER NOT NULL,
    "showId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "character" TEXT NOT NULL,

    CONSTRAINT "Cast_pkey" PRIMARY KEY ("personId","showId")
);

-- CreateTable
CREATE TABLE "Crew" (
    "personId" INTEGER NOT NULL,
    "showId" INTEGER NOT NULL,
    "department" TEXT NOT NULL,
    "job" TEXT NOT NULL,

    CONSTRAINT "Crew_pkey" PRIMARY KEY ("personId","showId")
);

-- AddForeignKey
ALTER TABLE "Cast" ADD CONSTRAINT "Cast_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cast" ADD CONSTRAINT "Cast_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crew" ADD CONSTRAINT "Crew_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crew" ADD CONSTRAINT "Crew_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show"("id") ON DELETE CASCADE ON UPDATE CASCADE;

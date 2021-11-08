-- CreateTable
CREATE TABLE "ProductionCompany" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "externalId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductionCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductionCompanyToShow" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductionCompany_externalId_key" ON "ProductionCompany"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductionCompanyToShow_AB_unique" ON "_ProductionCompanyToShow"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductionCompanyToShow_B_index" ON "_ProductionCompanyToShow"("B");

-- AddForeignKey
ALTER TABLE "_ProductionCompanyToShow" ADD FOREIGN KEY ("A") REFERENCES "ProductionCompany"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductionCompanyToShow" ADD FOREIGN KEY ("B") REFERENCES "Show"("id") ON DELETE CASCADE ON UPDATE CASCADE;

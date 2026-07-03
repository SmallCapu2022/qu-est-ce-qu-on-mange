-- CreateTable
CREATE TABLE "SeasonalIngredient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "months" INTEGER[],

    CONSTRAINT "SeasonalIngredient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SeasonalIngredient_name_key" ON "SeasonalIngredient"("name");

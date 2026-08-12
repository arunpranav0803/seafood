/*
  Warnings:

  - Added the required column `slug` to the `Banner` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Banner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "ctaLabel" TEXT NOT NULL,
    "ctaDestination" TEXT,
    "imageUrl" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Banner" ("createdAt", "ctaDestination", "ctaLabel", "displayOrder", "enabled", "endDate", "id", "imageUrl", "startDate", "subtitle", "title", "updatedAt") SELECT "createdAt", "ctaDestination", "ctaLabel", "displayOrder", "enabled", "endDate", "id", "imageUrl", "startDate", "subtitle", "title", "updatedAt" FROM "Banner";
DROP TABLE "Banner";
ALTER TABLE "new_Banner" RENAME TO "Banner";
CREATE UNIQUE INDEX "Banner_slug_key" ON "Banner"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

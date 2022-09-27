/*
  Warnings:

  - You are about to drop the column `descrition` on the `Technique` table. All the data in the column will be lost.
  - Added the required column `details` to the `Technique` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Technique" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "isBlueBelt" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdByUserId" TEXT NOT NULL,
    "updatedByUserId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "techniqueImage" TEXT NOT NULL,
    CONSTRAINT "Technique_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Technique_updatedByUserId_fkey" FOREIGN KEY ("updatedByUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Technique_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Technique" ("categoryId", "createdAt", "createdByUserId", "id", "isBlueBelt", "name", "techniqueImage", "updatedAt", "updatedByUserId") SELECT "categoryId", "createdAt", "createdByUserId", "id", "isBlueBelt", "name", "techniqueImage", "updatedAt", "updatedByUserId" FROM "Technique";
DROP TABLE "Technique";
ALTER TABLE "new_Technique" RENAME TO "Technique";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

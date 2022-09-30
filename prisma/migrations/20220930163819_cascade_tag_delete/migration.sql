-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TechniqueTag" (
    "tagId" TEXT NOT NULL,
    "techniqueId" TEXT NOT NULL,

    PRIMARY KEY ("tagId", "techniqueId"),
    CONSTRAINT "TechniqueTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TechniqueTag_techniqueId_fkey" FOREIGN KEY ("techniqueId") REFERENCES "Technique" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TechniqueTag" ("tagId", "techniqueId") SELECT "tagId", "techniqueId" FROM "TechniqueTag";
DROP TABLE "TechniqueTag";
ALTER TABLE "new_TechniqueTag" RENAME TO "TechniqueTag";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

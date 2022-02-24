/*
  Warnings:

  - Added the required column `type` to the `Challenges` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Challenges" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL
);
INSERT INTO "new_Challenges" ("id", "name") SELECT "id", "name" FROM "Challenges";
DROP TABLE "Challenges";
ALTER TABLE "new_Challenges" RENAME TO "Challenges";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

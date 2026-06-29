/*
  Warnings:

  - You are about to drop the `_ProjectToSkill` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProjectToSkill" DROP CONSTRAINT "_ProjectToSkill_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectToSkill" DROP CONSTRAINT "_ProjectToSkill_B_fkey";

-- DropTable
DROP TABLE "_ProjectToSkill";

-- CreateTable
CREATE TABLE "_ProjectSkills" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectSkills_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProjectSkills_B_index" ON "_ProjectSkills"("B");

-- AddForeignKey
ALTER TABLE "_ProjectSkills" ADD CONSTRAINT "_ProjectSkills_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectSkills" ADD CONSTRAINT "_ProjectSkills_B_fkey" FOREIGN KEY ("B") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - A unique constraint covering the columns `[joinCode]` on the table `BpCompany` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "BpCompany" ADD COLUMN     "joinCode" TEXT;

-- AlterTable
ALTER TABLE "Engineer" ADD COLUMN     "bpCompanyId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bpCompanyId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "BpCompany_joinCode_key" ON "BpCompany"("joinCode");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_bpCompanyId_fkey" FOREIGN KEY ("bpCompanyId") REFERENCES "BpCompany"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Engineer" ADD CONSTRAINT "Engineer_bpCompanyId_fkey" FOREIGN KEY ("bpCompanyId") REFERENCES "BpCompany"("id") ON DELETE SET NULL ON UPDATE CASCADE;

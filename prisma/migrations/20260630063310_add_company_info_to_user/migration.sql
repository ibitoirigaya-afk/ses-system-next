-- AlterTable
ALTER TABLE "User" ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "isBpCompany" BOOLEAN NOT NULL DEFAULT false;

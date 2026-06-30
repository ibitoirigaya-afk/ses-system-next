/*
  Warnings:

  - Made the column `joinCode` on table `BpCompany` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BpCompany" ALTER COLUMN "joinCode" SET NOT NULL;

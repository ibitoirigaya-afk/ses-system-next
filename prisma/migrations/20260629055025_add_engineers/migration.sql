-- CreateEnum
CREATE TYPE "EngineerStatus" AS ENUM ('available', 'proposed', 'working', 'inactive');

-- CreateTable
CREATE TABLE "Engineer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "age" INTEGER,
    "gender" TEXT,
    "nearestStation" TEXT,
    "desiredUnitPrice" INTEGER,
    "experienceYears" INTEGER,
    "availableDate" TIMESTAMP(3),
    "desiredLocation" TEXT,
    "desiredConditions" TEXT,
    "careerSummary" TEXT,
    "status" "EngineerStatus" NOT NULL DEFAULT 'available',
    "createdById" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Engineer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EngineerSkills" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EngineerSkills_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_EngineerSkills_B_index" ON "_EngineerSkills"("B");

-- AddForeignKey
ALTER TABLE "Engineer" ADD CONSTRAINT "Engineer_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EngineerSkills" ADD CONSTRAINT "_EngineerSkills_A_fkey" FOREIGN KEY ("A") REFERENCES "Engineer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EngineerSkills" ADD CONSTRAINT "_EngineerSkills_B_fkey" FOREIGN KEY ("B") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

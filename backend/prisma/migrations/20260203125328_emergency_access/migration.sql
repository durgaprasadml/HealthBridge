/*
  Warnings:

  - You are about to drop the column `abuseCount` on the `EmergencyAccess` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `EmergencyAccess` table. All the data in the column will be lost.
  - You are about to drop the column `emergencyCaseId` on the `EmergencyAccess` table. All the data in the column will be lost.
  - Added the required column `reason` to the `EmergencyAccess` table without a default value. This is not possible if the table is not empty.
  - Made the column `patientId` on table `EmergencyAccess` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "EmergencyStatus" AS ENUM ('ACTIVE', 'REVOKED', 'EXPIRED');

-- DropIndex
DROP INDEX "EmergencyAccess_emergencyCaseId_key";

-- AlterTable
ALTER TABLE "EmergencyAccess" DROP COLUMN "abuseCount",
DROP COLUMN "createdAt",
DROP COLUMN "emergencyCaseId",
ADD COLUMN     "reason" TEXT NOT NULL,
ADD COLUMN     "revokedAt" TIMESTAMP(3),
ADD COLUMN     "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "EmergencyStatus" NOT NULL DEFAULT 'ACTIVE',
ALTER COLUMN "patientId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "EmergencyAccess_doctorId_idx" ON "EmergencyAccess"("doctorId");

-- CreateIndex
CREATE INDEX "EmergencyAccess_patientId_idx" ON "EmergencyAccess"("patientId");

-- CreateIndex
CREATE INDEX "EmergencyAccess_hospitalId_idx" ON "EmergencyAccess"("hospitalId");

-- AddForeignKey
ALTER TABLE "EmergencyAccess" ADD CONSTRAINT "EmergencyAccess_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

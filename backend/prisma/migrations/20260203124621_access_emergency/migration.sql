/*
  Warnings:

  - The values [ADMIN] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `speciality` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `Hospital` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Hospital` table. All the data in the column will be lost.
  - You are about to drop the column `bloodGroup` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `dob` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `AccessLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DoctorHospital` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MedicalRecord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OTP` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[phone]` on the table `Doctor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[doctorUid]` on the table `Doctor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `doctorUid` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hospitalId` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Doctor` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AccessStatus" AS ENUM ('PENDING', 'APPROVED', 'REVOKED', 'EXPIRED');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('PATIENT', 'DOCTOR', 'HOSPITAL');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'PATIENT';
COMMIT;

-- DropForeignKey
ALTER TABLE "AccessLog" DROP CONSTRAINT "AccessLog_hospitalId_fkey";

-- DropForeignKey
ALTER TABLE "AccessLog" DROP CONSTRAINT "AccessLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorHospital" DROP CONSTRAINT "DoctorHospital_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorHospital" DROP CONSTRAINT "DoctorHospital_hospitalId_fkey";

-- DropForeignKey
ALTER TABLE "MedicalRecord" DROP CONSTRAINT "MedicalRecord_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "MedicalRecord" DROP CONSTRAINT "MedicalRecord_hospitalId_fkey";

-- DropForeignKey
ALTER TABLE "MedicalRecord" DROP CONSTRAINT "MedicalRecord_userId_fkey";

-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "speciality",
ADD COLUMN     "doctorUid" TEXT NOT NULL,
ADD COLUMN     "hospitalId" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Hospital" DROP COLUMN "latitude",
DROP COLUMN "longitude";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "bloodGroup",
DROP COLUMN "dob",
DROP COLUMN "gender",
DROP COLUMN "updatedAt";

-- DropTable
DROP TABLE "AccessLog";

-- DropTable
DROP TABLE "DoctorHospital";

-- DropTable
DROP TABLE "MedicalRecord";

-- DropTable
DROP TABLE "OTP";

-- DropEnum
DROP TYPE "Gender";

-- CreateTable
CREATE TABLE "AccessRequest" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "status" "AccessStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccessRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmergencyAccess" (
    "id" TEXT NOT NULL,
    "emergencyCaseId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "patientId" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "abuseCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmergencyAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorRole" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "targetId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmergencyAccess_emergencyCaseId_key" ON "EmergencyAccess"("emergencyCaseId");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_phone_key" ON "Doctor"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_doctorUid_key" ON "Doctor"("doctorUid");

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessRequest" ADD CONSTRAINT "AccessRequest_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessRequest" ADD CONSTRAINT "AccessRequest_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmergencyAccess" ADD CONSTRAINT "EmergencyAccess_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmergencyAccess" ADD CONSTRAINT "EmergencyAccess_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - Added the required column `otp` to the `OTP` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OTP" ADD COLUMN     "otp" TEXT NOT NULL;

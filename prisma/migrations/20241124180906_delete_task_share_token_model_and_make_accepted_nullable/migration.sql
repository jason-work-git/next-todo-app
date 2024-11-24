/*
  Warnings:

  - You are about to drop the `TaskShareToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TaskShareToken" DROP CONSTRAINT "TaskShareToken_taskId_fkey";

-- AlterTable
ALTER TABLE "Assignment" ALTER COLUMN "accepted" DROP NOT NULL,
ALTER COLUMN "accepted" DROP DEFAULT;

-- DropTable
DROP TABLE "TaskShareToken";

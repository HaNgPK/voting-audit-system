/*
  Warnings:

  - You are about to drop the column `groupId` on the `audits` table. All the data in the column will be lost.
  - You are about to drop the column `ballotNumber` on the `ballots` table. All the data in the column will be lost.
  - You are about to drop the column `ballotTypeId` on the `ballots` table. All the data in the column will be lost.
  - You are about to drop the column `groupId` on the `ballots` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `ballots` table. All the data in the column will be lost.
  - You are about to drop the column `ballotTypeId` on the `candidates` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `candidates` table. All the data in the column will be lost.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `_UserGroups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ballot_types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `groups` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[ballotId,index]` on the table `candidates` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `teamId` to the `audits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `ballots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `ballots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ballotId` to the `candidates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birthYear` to the `candidates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `candidates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `index` to the `candidates` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_UserGroups" DROP CONSTRAINT "_UserGroups_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserGroups" DROP CONSTRAINT "_UserGroups_B_fkey";

-- DropForeignKey
ALTER TABLE "audits" DROP CONSTRAINT "audits_groupId_fkey";

-- DropForeignKey
ALTER TABLE "ballots" DROP CONSTRAINT "ballots_ballotTypeId_fkey";

-- DropForeignKey
ALTER TABLE "ballots" DROP CONSTRAINT "ballots_groupId_fkey";

-- DropForeignKey
ALTER TABLE "candidates" DROP CONSTRAINT "candidates_ballotTypeId_fkey";

-- DropIndex
DROP INDEX "ballots_groupId_ballotTypeId_ballotNumber_key";

-- DropIndex
DROP INDEX "candidates_ballotTypeId_order_key";

-- AlterTable
ALTER TABLE "audits" DROP COLUMN "groupId",
ADD COLUMN     "teamId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ballots" DROP COLUMN "ballotNumber",
DROP COLUMN "ballotTypeId",
DROP COLUMN "groupId",
DROP COLUMN "status",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "level" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "candidates" DROP COLUMN "ballotTypeId",
DROP COLUMN "order",
ADD COLUMN     "ballotId" TEXT NOT NULL,
ADD COLUMN     "birthYear" INTEGER NOT NULL,
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "index" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "address" TEXT,
DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'AUDITOR';

-- DropTable
DROP TABLE "_UserGroups";

-- DropTable
DROP TABLE "ballot_types";

-- DropTable
DROP TABLE "groups";

-- DropEnum
DROP TYPE "BallotStatus";

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voters" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "idNumber" TEXT,
    "teamId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "voters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TeamAuditors" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TeamAuditors_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_TeamBallots" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TeamBallots_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TeamAuditors_B_index" ON "_TeamAuditors"("B");

-- CreateIndex
CREATE INDEX "_TeamBallots_B_index" ON "_TeamBallots"("B");

-- CreateIndex
CREATE UNIQUE INDEX "candidates_ballotId_index_key" ON "candidates"("ballotId", "index");

-- AddForeignKey
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_ballotId_fkey" FOREIGN KEY ("ballotId") REFERENCES "ballots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voters" ADD CONSTRAINT "voters_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audits" ADD CONSTRAINT "audits_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamAuditors" ADD CONSTRAINT "_TeamAuditors_A_fkey" FOREIGN KEY ("A") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamAuditors" ADD CONSTRAINT "_TeamAuditors_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamBallots" ADD CONSTRAINT "_TeamBallots_A_fkey" FOREIGN KEY ("A") REFERENCES "ballots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamBallots" ADD CONSTRAINT "_TeamBallots_B_fkey" FOREIGN KEY ("B") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

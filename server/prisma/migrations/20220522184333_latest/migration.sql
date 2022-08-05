/*
  Warnings:

  - You are about to drop the column `endDatetime` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `startDatetime` on the `Activity` table. All the data in the column will be lost.
  - Added the required column `endDateTime` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDateTime` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "endDatetime",
DROP COLUMN "startDatetime",
ADD COLUMN     "endDateTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDateTime" TIMESTAMP(3) NOT NULL;

/*
  Warnings:

  - You are about to alter the column `resetToken` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "resetToken" SET DATA TYPE VARCHAR(255);

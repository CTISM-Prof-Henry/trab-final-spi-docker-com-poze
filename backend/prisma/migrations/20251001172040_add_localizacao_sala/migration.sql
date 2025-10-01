/*
  Warnings:

  - Added the required column `localizacao` to the `Sala` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sala" ADD COLUMN     "localizacao" TEXT NOT NULL;

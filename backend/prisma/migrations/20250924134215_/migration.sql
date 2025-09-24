/*
  Warnings:

  - You are about to drop the column `departamentoId` on the `Sala` table. All the data in the column will be lost.
  - You are about to drop the `Departamento` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `centroId` to the `Sala` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Sala" DROP CONSTRAINT "Sala_departamentoId_fkey";

-- AlterTable
ALTER TABLE "public"."Sala" DROP COLUMN "departamentoId",
ADD COLUMN     "centroId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."Departamento";

-- CreateTable
CREATE TABLE "public"."Centro" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "localizacao" TEXT NOT NULL,

    CONSTRAINT "Centro_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Sala" ADD CONSTRAINT "Sala_centroId_fkey" FOREIGN KEY ("centroId") REFERENCES "public"."Centro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

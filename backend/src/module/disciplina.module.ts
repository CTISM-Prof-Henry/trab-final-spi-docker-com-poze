import { Module } from "@nestjs/common";
import { DisciplinaController } from "src/controller/disciplina.controller";
import { PrismaService } from "src/database/prisma.service";
import { DisciplinaService } from "src/service/disciplina.service";

@Module({
    imports: [PrismaService],
    controllers: [DisciplinaController],
    providers: [DisciplinaService]
})

export class DisciplinaModule {}

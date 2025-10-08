import { Module } from "@nestjs/common";
import { DisciplinaController } from "src/controller/disciplina.controller";
import { DisciplinaService } from "src/service/disciplina.service";

@Module({
    imports: [],
    controllers: [DisciplinaController],
    providers: [DisciplinaService]
})

export class DisciplinaModule {}

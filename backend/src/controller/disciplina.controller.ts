import { Controller, Get } from "@nestjs/common";
import { DisciplinaService } from "src/service/disciplina.service";

@Controller('disciplina')
export class DisciplinaController {

    constructor(private disciplinaService: DisciplinaService) {}

    @Get('find-all')
    findAll() {
        return this.disciplinaService.findAll();
    }

}

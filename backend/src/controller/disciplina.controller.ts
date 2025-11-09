import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { DisciplinaDTO } from "src/core/dtos/disciplina.dto";
import { DisciplinaService } from "src/service/disciplina.service";

@Controller('disciplina')
export class DisciplinaController {

    constructor(private disciplinaService: DisciplinaService) {}

    @Get('find-all')
    findAll() {
        return this.disciplinaService.findAll();
    }

    @Post()
    create(@Body() dto: DisciplinaDTO) {
        return this.disciplinaService.create(dto);
    }

    @Delete(':id')
    deleteById(@Param('id') disciplinaId: number) {
        return this.disciplinaService.deleteById(Number(disciplinaId));
    }

    @Patch(':id')
    updateById(@Param('id') disciplinaId: number, @Body() dto: DisciplinaDTO) {
        return this.disciplinaService.updateById(Number(disciplinaId), dto);
    }
}

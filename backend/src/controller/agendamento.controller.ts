import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { AgendamentoDTO } from "src/core/dtos/agendamento.dto";
import { AgendamentoService } from "src/service/agendamento.service";

@Controller('agendamento')
export class AgendamentoController {

    constructor(private agendamentoService: AgendamentoService) {}

    @Get('find-all')
    findAll() {
        return this.agendamentoService.findAll();
    }

    @Post()
    create(@Body() dto: AgendamentoDTO) {
        return this.agendamentoService.create(dto);
    }

    @Delete(':id')
    deleteById(@Param('id') agendamentoId: number) {
        return this.agendamentoService.deleteById(Number(agendamentoId));
    }

    @Patch(':id')
    updateById(@Param('id') agendamentoId: number, @Body() dto: AgendamentoDTO) {
        return this.agendamentoService.updateById(Number(agendamentoId), dto);
    }

    @Get('/find-by-user/:uuid')
    findByUserUuid(@Param('uuid') userUuid: string) {
        return this.agendamentoService.findByUserUuid(userUuid);
    }

}
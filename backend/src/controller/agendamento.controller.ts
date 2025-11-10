import { Controller, Get } from "@nestjs/common";
import { AgendamentoService } from "src/service/agendamento.service";

@Controller('agendamento')
export class AgendamentoController {

    constructor(private agendamentoService: AgendamentoService) {}

    @Get('find-all')
    findAll() {
        return this.agendamentoService.findAll();
    }
}
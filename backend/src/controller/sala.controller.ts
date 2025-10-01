import { Controller, Get, Param } from "@nestjs/common";
import { SalaService } from "src/service/sala.service";

@Controller('sala')
export class SalaController {

    constructor (private salaService: SalaService) {}

    @Get('find-all-by-centro-id/:centroId')
    findAllByCentroId(@Param('centroId') centroId: number) {
        return this.salaService.findAllSalasByCentroId(Number(centroId));
    }
}

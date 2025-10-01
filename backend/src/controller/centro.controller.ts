import { Body, Controller, Post } from "@nestjs/common";
import { CentroDTO } from "src/core/dtos/centro.dto";
import { CentroService } from "src/service/centro.service";

@Controller('centro')
export class CentroController {

    constructor(private centroService: CentroService) {}

    @Post()
    createCentro(@Body() dto: CentroDTO) {
        return this.centroService.createCentro(dto);
    }
}
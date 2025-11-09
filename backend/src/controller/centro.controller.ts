import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CentroDTO } from "src/core/dtos/centro.dto";
import { CentroService } from "src/service/centro.service";

@Controller('centro')
export class CentroController {

    constructor(private centroService: CentroService) {}

    @Post()
    createCentro(@Body() dto: CentroDTO) {
        return this.centroService.createCentro(dto);
    }

    @Get('find-all')
    findAllCentros() {
        return this.centroService.findAllCentros();
    }

    @Delete(':id')
    deleteCentroById(@Param('id') centroId: number) {
        return this.centroService.deleteCentroById(Number(centroId));
    }

    @Patch(':id')
    updateCentroById(@Param('id') centroId: number, @Body() dto: CentroDTO) {
        return this.centroService.updateCentroById(Number(centroId), dto);
    }

}
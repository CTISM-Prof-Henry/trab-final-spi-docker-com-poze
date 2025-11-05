import { Body, Controller, Get, Param } from "@nestjs/common";
import { PaginationDTO } from "src/core/dtos/pagination.dto";
import { SalaService } from "src/service/sala.service";

@Controller('sala')
export class SalaController {

    constructor (private salaService: SalaService) {}

    @Get('find-all-by-centro-id/:centroId')
    findAllByCentroId(@Param('centroId') centroId: number) {
        return this.salaService.findAllSalasByCentroId(Number(centroId));
    }

    @Get('find-all/paginated/:page/:limit')
    findAllPaginated(@Param("page") page: number, @Param("limit") limit: number) {
        let paginationDTO = new PaginationDTO();
        paginationDTO.limit = Number(limit);
        paginationDTO.page = Number(page);
        return this.salaService.findAllSalasPaginated(paginationDTO);
    }
}

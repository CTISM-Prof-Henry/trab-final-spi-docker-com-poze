import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PaginationDTO } from "src/core/dtos/pagination.dto";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class SalaService {

    constructor(private prismaService: PrismaService) {}

    async findAllSalasByCentroId(centroId: number) {
        try {
            const salas = await this.prismaService.sala.findMany({
                where: { centroId },
                orderBy: { nome: 'asc'}
            });

            const salasDTO = salas.map(sala => ({
                id: sala.id,
                nome: sala.nome,
                capacidade: sala.capacidade,
                centroId: sala.centroId
            }));

            return salasDTO;
        } catch (error) {
            throw new InternalServerErrorException("Não foi possivel buscar as salas do centro. " + error);
        }
    }

    async findAllSalasPaginated(paginationDTO: PaginationDTO) {
        try {
            const skip = (paginationDTO.page!) * paginationDTO.limit!;
            const [salas, total] = await Promise.all([
                this.prismaService.sala.findMany({
                    skip,
                    take: paginationDTO.limit,
                    include: {
                        centro: true
                    },
                    orderBy: [
                        { nome: 'asc' },
                        {
                            centro: { 
                                nome: 'asc' 
                            }
                        }
                    ],
                }), this.prismaService.sala.count()
            ]);

            return {
                message: "Salas encontradas com sucesso!",
                data: {
                    total,
                    page: paginationDTO.page,
                    lastPage: Math.ceil(total / paginationDTO.limit!),
                    salas
                },
            };
        } catch (error) {
            throw new InternalServerErrorException("Ocorreu um erro ao tentar busar." + error);
        }
    }
}

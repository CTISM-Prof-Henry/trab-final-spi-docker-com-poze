import { Injectable, InternalServerErrorException } from "@nestjs/common";
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
}

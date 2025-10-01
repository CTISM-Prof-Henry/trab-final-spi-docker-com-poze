import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { CentroDTO } from "src/core/dtos/centro.dto";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class CentroService {

    constructor(private prismaService: PrismaService) {}

    async createCentro(dto: CentroDTO) {
        if (!dto.nome || !dto.localizacao) {
            throw new BadRequestException("É preciso enviar nome e localização para criar um centro.");
        }

        const alreadyExiste = await this.prismaService.centro.findFirst({
            where: { nome: dto.nome }
        });

        if (alreadyExiste) {
            throw new BadRequestException("Já existe um centro com esse nome.");
        }

        try {
            return await this.prismaService.centro.create({
                data: {
                    nome: dto.nome,
                    localizacao: dto.localizacao,
                }
            });
        } catch (error) {
            throw new InternalServerErrorException("Não foi possivel criar o centro. " + error);
        }
    }

}

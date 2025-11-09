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

    async findAllCentros() {
        try {
            const centros = await this.prismaService.centro.findMany();
            const centrosDTO: CentroDTO[] = centros.map(c => ({
                id: c.id,
                nome: c.nome,
                localizacao: c.localizacao
            }));

            return centrosDTO;
        } catch (error) {
            throw new InternalServerErrorException("Não foi possivel buscar os centros. " + error);
        }
    }

    async deleteCentroById(centroId: number) {
        try {
            await this.prismaService.centro.delete({
                where: { id: centroId }
            });
        } catch (error) {
            throw new InternalServerErrorException("Não foi possivel deletar o centro. " + error);
        }
    }

    async updateCentroById(centroId: number, dto: CentroDTO) {
        try {
            if (!dto.nome || !dto.localizacao) {
                throw new BadRequestException("É preciso enviar nome e localização para criar um centro.");
            }
            return await this.prismaService.centro.update({
                where: { id: centroId },
                data: {
                    nome: dto.nome,
                    localizacao: dto.localizacao,
                }
            });
        } catch (error) {
            throw new InternalServerErrorException("Não foi possivel atualizar o centro. " + error);
        }
    }
}

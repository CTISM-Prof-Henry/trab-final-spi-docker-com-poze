import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { DisciplinaDTO } from "src/core/dtos/disciplina.dto";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class DisciplinaService {

    constructor (private prismaService: PrismaService) {}

    async findAll() {
        try {
            const disciplinas = await this.prismaService.disciplina.findMany();
            const disciplinasDTO: DisciplinaDTO[] = disciplinas.map(disciplina => {
                const { id, nome, codigo, cargaHoraria } = disciplina;
                return { id, nome, codigo, cargaHoraria };
            })

            return disciplinasDTO;
        } catch (error) {
            throw new InternalServerErrorException('Não foi possivel encontrar as disciplinas.');
        }
    }
}
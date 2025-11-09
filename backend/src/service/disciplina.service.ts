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

    async create(dto: DisciplinaDTO) {
        try {
            if (!dto.nome || !dto.codigo || !dto.cargaHoraria) {
                throw new InternalServerErrorException('É preciso enviar nome, código e carga horária para criar uma disciplina.');
            }

            const alreadyExists = await this.prismaService.disciplina.findFirst({
                where: { codigo: dto.codigo }
            });

            if (alreadyExists) {
                throw new InternalServerErrorException('Já existe uma disciplina com esse código.');
            }

            const created = await this.prismaService.disciplina.create({
                data: {
                    nome: dto.nome,
                    codigo: dto.codigo,
                    cargaHoraria: dto.cargaHoraria
                }
            });

            return created;
        } catch(error) {
            throw new InternalServerErrorException('Não foi possivel criar a disciplina. ' + error);
        }
    }

    async deleteById(disciplinaId: number) {
        try {
            await this.prismaService.disciplina.delete({
                where: { id: disciplinaId }
            });
            return "Disciplina deletada com sucesso.";
        } catch (error) {
            throw new InternalServerErrorException('Não foi possivel deletar a disciplina.');
        }
    }

    async updateById(disciplinaId: number, dto: DisciplinaDTO) {
        if (!dto.nome || !dto.codigo || !dto.cargaHoraria) {
            throw new InternalServerErrorException('É preciso enviar nome, código e carga horária para atualizar uma disciplina.');
        }

        const disciplina =  await this.prismaService.disciplina.update({
            where: { id: disciplinaId },
            data: {
                nome: dto.nome,
                codigo: dto.codigo,
                cargaHoraria: dto.cargaHoraria
            }
        });

        return disciplina;
    }
}
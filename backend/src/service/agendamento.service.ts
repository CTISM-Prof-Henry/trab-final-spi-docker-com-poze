import { Injectable } from "@nestjs/common";
import { StatusAgendamento, TipoUsuario } from "@prisma/client";
import { AgendamentoDTO } from "src/core/dtos/agendamento.dto";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class AgendamentoService {
    constructor(private prismaService: PrismaService) {}

    async findAll() {
        const agendamentos = await this.prismaService.agendamento.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        matricula: true,
                        tipo: true,
                    }
                },
                sala: true,
                disciplina: true,
            }
        });
        const dto: AgendamentoDTO[] = agendamentos.map(agendamento => ({
            id: agendamento.id,
            data: agendamento.data,
            horaInicio: agendamento.horaInicio.toString(),
            horaFim: agendamento.horaFim.toString(),
            status: agendamento.status,
            user: agendamento.user,
            sala: agendamento.sala,
            disciplina: agendamento.disciplina,
        }));
        return dto;
    }

    async create(dto: AgendamentoDTO) {
        if (!dto.data || !dto.horaInicio || !dto.horaFim || !dto.user || !dto.sala || !dto.disciplina) {
            throw new Error('Dados incompletos para criar agendamento.');
        }
        const status = dto.user.tipo === TipoUsuario.ALUNO ? StatusAgendamento.PENDENTE : StatusAgendamento.CONFIRMADO;
        const agendamento = await this.prismaService.agendamento.create({
            data: {
                data: dto.data,
                horaInicio: dto.horaInicio,
                horaFim: dto.horaFim,
                status: status,
                userId: dto.user.id!,
                salaId: dto.sala.id!,
                disciplinaId: dto.disciplina.id!,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        matricula: true,
                        tipo: true,
                    }
                },
                sala: true,
                disciplina: true,
            }
        });
        const createdDto: AgendamentoDTO = {
            id: agendamento.id,
            data: agendamento.data,
            horaInicio: agendamento.horaInicio.toString(),
            horaFim: agendamento.horaFim.toString(),
            status: agendamento.status,
            user: agendamento.user,
            sala: agendamento.sala,
            disciplina: agendamento.disciplina,
        };

        return createdDto;
    }

    async deleteById(idAgendamento: number) {
        await this.prismaService.agendamento.delete({
            where: { id: idAgendamento }
        });

        return "Agendamento deletado com sucesso.";
    }

}
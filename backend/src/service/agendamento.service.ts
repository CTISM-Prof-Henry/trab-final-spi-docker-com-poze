import { Injectable } from "@nestjs/common";
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
            date: agendamento.data,
            horaInicio: agendamento.horaInicio.toString(),
            horaFim: agendamento.horaFim.toString(),
            status: agendamento.status,
            user: agendamento.user,
            sala: agendamento.sala,
            disciplina: agendamento.disciplina,
        }));
        return dto;
    }
}
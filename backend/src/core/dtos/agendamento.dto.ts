import { StatusAgendamento } from "@prisma/client";
import { UserDTO } from "./user.dto";
import SalaDTO from "./sala.dto";
import { DisciplinaDTO } from "./disciplina.dto";

export class AgendamentoDTO {
    id?: number;
    data?: Date;
    horaInicio?: string;
    horaFim?: string;
    status?: StatusAgendamento;
    user?: UserDTO;
    sala?: SalaDTO;
    disciplina?: DisciplinaDTO;
}

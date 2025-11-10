import { StatusAgendamento } from "../enum/status-agendamento.enum";
import { DisciplinaDTO } from "./disciplina.dto"
import { SalaDTO } from "./sala.dto"
import UserDTO from "./user.dto"

export class AgendamentoDTO {
    id?: number;
    date?: Date;
    horaInicio?: string;
    horaFim?: string;
    status?: StatusAgendamento;
    user?: UserDTO;
    sala?: SalaDTO;
    disciplina?: DisciplinaDTO;
}
import { StatusAgendamento } from "../enum/status-agendamento.enum";
import { DisciplinaDTO } from "./disciplina.dto"
import { SalaDTO } from "./sala.dto"
import UserDTO from "./user.dto"

export class AgendamentoDTO {
    id?: number;
    data?: Date;
    horaInicio?: Date;
    horaFim?: Date;
    status?: StatusAgendamento;
    user?: UserDTO;
    sala?: SalaDTO;
    disciplina?: DisciplinaDTO;
}
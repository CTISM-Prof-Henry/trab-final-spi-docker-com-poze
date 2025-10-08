import { AgendamentoDTO } from "./agendamento.dto";

export class DisciplinaDTO {
    id?: number;
    nome?: string;
    codigo?: string;
    cargaHoraria?: number;
    agendamentos?: AgendamentoDTO[];
}

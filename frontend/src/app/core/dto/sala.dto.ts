import { CentroDTO } from "./centro.dto";

export class SalaDTO {
    id?: number;
    nome?: string;
    capacidade?: number;
    localizacao?: string;
    centro?: CentroDTO;
    agendamentos?: any[]; // TODO: criar AgendamentoDTO
}
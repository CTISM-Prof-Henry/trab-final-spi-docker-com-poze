import { CentroDTO } from "./centro.dto";

export class SalaDTO {
    id?: number;
    nome?: string;
    capacidade?: number;
    localizacao?: string;
    centroId?: number;
    centro?: CentroDTO;
    agendamentos?: any[]; // TODO: criar AgendamentoDTO
}
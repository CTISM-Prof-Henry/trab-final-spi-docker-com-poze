import { SalaDTO } from "./sala.dto";

export class CentroDTO {
    id?: number;
    nome?: string;
    localizacao?: string;
    salas?: SalaDTO[];
}
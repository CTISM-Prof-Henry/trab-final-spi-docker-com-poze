import { CentroDTO } from "./centro.dto";

export default class SalaDTO {
    id?: number;
    nome?: string;
    capacidade?: number;
    localizacao?: string;
    centro?: CentroDTO;
}
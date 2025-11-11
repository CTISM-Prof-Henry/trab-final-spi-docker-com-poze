import { TipoUsuario } from "@prisma/client";

export class UserDTO {
    id?: number;
    uuid?: string;
    name?: string;
    email?: string;
    password?: string;
    matricula?: string;
    tipo?: TipoUsuario;
};
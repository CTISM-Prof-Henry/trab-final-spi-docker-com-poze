import { TipoUsuario } from "@prisma/client";

export class UserDTO {
    id!: number;
    name!: string;
    email!: string;
    password!: string;
    matricula!: string;
    tipo!: TipoUsuario;
};
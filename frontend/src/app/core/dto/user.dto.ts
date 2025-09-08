import { TipoUsuario } from "./tipo-usuario.enum";

export default class UserDTO {
    id?: number;
    uuid?: string;
    email!: string;
    name!: string;
    password!: string;
    matricula!: string;
    tipo!: TipoUsuario;
}
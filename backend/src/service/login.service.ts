import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { UserDTO } from "src/core/dtos/user.dto";

@Injectable()
export class LoginService {

    constructor (private prismaService: PrismaService) {}

    async authenticate(body: UserDTO) {
        const { email, password } = body;

        if (!email || !password) {
            throw new BadRequestException("É preciso enviar email e senha.");
        }

        const user = await this.prismaService.user.findUnique({
            where: { email }
        });

        if (!user) {
            throw new NotFoundException("Usuário não encontrado.");
        }

        if (user.password !== password) {
            throw new BadRequestException("Senha inválida.");
        }

    }

}
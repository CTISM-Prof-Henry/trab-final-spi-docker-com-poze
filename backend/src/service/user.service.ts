import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { UserDTO } from "../core/dtos/user.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {

    constructor (private prismaService: PrismaService) {}

    async getUsers() {
        try {
            const users = await this.prismaService.user.findMany();
            const usersDTO = users.map(user => {
                const { uuid, name, email, matricula, tipo } = user;
                return {  uuid, name, email, matricula, tipo };
            })

            return usersDTO;
        } catch (error) {
            throw new InternalServerErrorException('Não foi possivel encontrar os usuários.');
        }
    }

    async create(data: UserDTO) {
        const { name, email, password, matricula, tipo } = data;

        if (!name || !email || !password || !matricula || !tipo) {
            throw new BadRequestException('Nome, email, senha, matrícula e tipo são obrigatórios.');
        }

        const userExists = await this.prismaService.user.findUnique({
            where: { email }
        });

        if (userExists) {
            throw new BadRequestException('Usuário já cadastrado.');
        }

        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            return this.prismaService.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    matricula,
                    tipo
                }
            })
        } catch (error) {
            throw new InternalServerErrorException('Não foi possivel criar o usuário.');
        }
    }
}
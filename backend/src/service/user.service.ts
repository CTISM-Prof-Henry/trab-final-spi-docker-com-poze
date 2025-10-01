import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { UserDTO } from "../core/dtos/user.dto";
import * as bcrypt from "bcrypt";
import { CentroDTO } from "src/core/dtos/centro.dto";
import SalaDTO from "src/core/dtos/sala.dto";

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

    async populate() {
        const centros: CentroDTO[] = [
            {
                nome: 'Centro de Tecnologia (CT)',
                localizacao: 'Av. Roraima, 1000 - Camobi, Santa Maria - RS, 97105-900',
            },
            {
                nome: 'Colégio Politécnico',
                localizacao: 'Av. Roraima, 1000 - Camobi, Santa Maria - RS, 97105-100',
            },
            {
                nome: 'Centro de Ciências Sociais e Humanas (CCSH)',
                localizacao: 'Av. Roraima, 11841000 - Camobi, Santa Maria - RS, 97105-340',
            },
            {
                nome: 'Centro de Ciências Naturais e Exatas (CCNE)',
                localizacao: 'Av. Roraima, 1000 - Camobi, Santa Maria - RS, 97105-900',
            },
            {
                nome: 'Centro de Ciências da Saúde (CCS)',
                localizacao: 'UFSM Prédio 26 - Camobi, Santa Maria - RS',
            },
            {
                nome: 'Centro de Artes e Letras (CAL)',
                localizacao: 'Prédio 40 Cidade Universitária - Av. Roraima, 1000 - Sala 1212 - Camobi, Santa Maria - RS, 97105-900',
            },
            {
                nome: 'Centro de Ciências Rurais (CCR)',
                localizacao: 'Av. Roraima nº 1000 Cidade Universitária Bairro - Camobi, Santa Maria - RS, 97105-900',
            },
            {
                nome: 'Centro de Educação Física e Desportos (CEFD)',
                localizacao: '77HR+P4 - Av. Roraima, 1000 - Camobi, Santa Maria - RS, 97105-900',
            },
            {
                nome: 'Centro de Educação (CE)',
                localizacao: 'Av. Roraima, 1000 - Prédio 16 - Camobi, Santa Maria - RS, 97105-302',
            },
            {
                nome: 'Colégio Técnico Industrial de Santa Maria (CTISM)',
                localizacao: 'Av. Roraima, 1000 - Camobi, Santa Maria - RS, 97105-000',
            },
        ];

        const allCentros = await this.prismaService.centro.createMany({
            data: centros.map(c => ({
                nome: c.nome ?? "",
                localizacao: c.localizacao ?? ""
            })),
            skipDuplicates: true,
        });

        let salasDTO: SalaDTO[] = [];
        const letraPredio = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
        for (let qtdCentros = 0; qtdCentros < centros.length; qtdCentros++) {
            for (let predios = 0; predios < 6; predios++) {
                for (let andar = 1; andar <= 3; andar++) {
                    for (let salas = 1; salas <= 12; salas++) {
                        const sala: SalaDTO = {
                            nome: `${letraPredio[predios]}0${andar}${salas < 10 ? '0' : ''}${salas}`,
                            capacidade: Math.floor(Math.random() * (60 - 20 + 1)) + 20,
                            centro: { id: qtdCentros + 1 }
                        }

                        salasDTO.push(sala);                        
                    }
                }
            }
        }

        const allSalas = await this.prismaService.sala.createMany({
            data: salasDTO.map(s => ({
                nome: s.nome ?? "",
                capacidade: s.capacidade ?? 0,
                centroId: s.centro?.id ?? 0
            })),
            skipDuplicates: true,
        });

        return "Banco de dados populado com centros e salas.";
    }
}

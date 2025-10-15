import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../service/user.service';
import { PrismaService } from '../database/prisma.service';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { TipoUsuario } from '@prisma/client';

// Mock do módulo bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
            },
            centro: { createMany: jest.fn() },
            sala: { createMany: jest.fn() },
            disciplina: { createMany: jest.fn() },
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  // ------------------------------------------------------------
  // TESTE 1: Deve retornar lista de usuários simplificada
  // ------------------------------------------------------------
  it('deve retornar lista de usuários com campos filtrados', async () => {
    const mockUsers = [
      { uuid: '1', name: 'João', email: 'joao@test.com', matricula: '123', tipo: 'ADMIN', password: 'hash' },
      { uuid: '2', name: 'Maria', email: 'maria@test.com', matricula: '456', tipo: 'ALUNO', password: 'hash' },
    ];
    (prismaService.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

    const result = await userService.getUsers();

    expect(result).toEqual([
      { uuid: '1', name: 'João', email: 'joao@test.com', matricula: '123', tipo: 'ADMIN' },
      { uuid: '2', name: 'Maria', email: 'maria@test.com', matricula: '456', tipo: 'ALUNO' },
    ]);
    expect(prismaService.user.findMany).toHaveBeenCalledTimes(1);
  });

  // ------------------------------------------------------------
  // TESTE 2: Deve criar usuário com sucesso
  // ------------------------------------------------------------
  it('deve criar um novo usuário com sucesso', async () => {
    const mockUserDTO = {
      id: 72,
      name: 'Ana',
      email: 'ana@test.com',
      password: 'senha123',
      matricula: '789',
      tipo: TipoUsuario.ADMIN,
    };
    const hashed = 'hashed_password';
    const mockUserCreated = { ...mockUserDTO, uuid: '123', password: hashed };

    (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue(hashed);
    (prismaService.user.create as jest.Mock).mockResolvedValue(mockUserCreated);

    const result = await userService.create(mockUserDTO);

    expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: mockUserDTO.email } });
    expect(bcrypt.hash).toHaveBeenCalledWith(mockUserDTO.password, 10);
    expect(prismaService.user.create).toHaveBeenCalledWith({
      data: {
        name: 'Ana',
        email: 'ana@test.com',
        password: hashed,
        matricula: '789',
        tipo: 'ADMIN',
      },
    });
    expect(result).toEqual(mockUserCreated);
  });

  // ------------------------------------------------------------
  // TESTE 3: Deve lançar erro se o usuário já existe
  // ------------------------------------------------------------
  it('deve lançar BadRequestException se o usuário já existir', async () => {
    const mockUserDTO = {
      id: 1,
      name: 'João',
      email: 'joao@test.com',
      password: '123456',
      matricula: '001',
      tipo: TipoUsuario.ALUNO,
    };
    (prismaService.user.findUnique as jest.Mock).mockResolvedValue({ id: 1, email: 'joao@test.com' });

    await expect(userService.create(mockUserDTO)).rejects.toThrow(BadRequestException);
  });
});
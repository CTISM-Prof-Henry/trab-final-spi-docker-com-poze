import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { UserDTO } from './core/dtos/user.dto';

@Controller()
export class AppController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  async getHello(): Promise<{ message: string }> {
    return {
      message: 'Hello World!',
    };
  }
}

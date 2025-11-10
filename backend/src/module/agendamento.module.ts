import { Module } from "@nestjs/common";
import { AgendamentoController } from "src/controller/agendamento.controller";
import { PrismaModule } from "src/database/prisma.module";
import { AgendamentoService } from "src/service/agendamento.service";

@Module({
    imports: [PrismaModule],
    controllers: [AgendamentoController],
    providers: [AgendamentoService],
})

export class AgendamentoModule {}
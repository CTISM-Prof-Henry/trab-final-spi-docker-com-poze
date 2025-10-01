import { Module } from "@nestjs/common";
import { SalaController } from "src/controller/sala.controller";
import { PrismaModule } from "src/database/prisma.module";
import { SalaService } from "src/service/sala.service";

@Module({
    imports: [PrismaModule],
    controllers: [SalaController],
    providers: [SalaService],
})

export class SalaModule {}

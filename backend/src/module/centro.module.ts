import { Module } from "@nestjs/common";
import { CentroController } from "src/controller/centro.controller";
import { PrismaModule } from "src/database/prisma.module";
import { CentroService } from "src/service/centro.service";

@Module({
    imports: [PrismaModule],
    controllers: [CentroController],
    providers: [CentroService]
})

export class CentroModule {}

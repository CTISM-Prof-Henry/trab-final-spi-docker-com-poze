import { Module } from "@nestjs/common";
import { LoginController } from "src/controller/login.controller";
import { PrismaModule } from "src/database/prisma.module";
import { LoginService } from "src/service/login.service";

@Module({
    imports: [PrismaModule],
    controllers: [LoginController],
    providers: [LoginService]
})

export class LoginModule {}

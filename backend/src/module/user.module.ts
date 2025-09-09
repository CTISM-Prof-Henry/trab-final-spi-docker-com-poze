import { Module } from "@nestjs/common";
import { UserController } from "../controller/user.controller";
import { UserService } from "../service/user.service";
import { PrismaModule } from "src/database/prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [UserController],
    providers: [UserService]
})

export class UserModule {}
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { RtStrategy } from "./strategies/rt.strategy";
import { PrismaService } from "src/database/prisma.service";

@Module({
    imports: [JwtModule.register({})],
    controllers: [AuthController],
    providers: [
        AuthService, 
        LocalStrategy, 
        JwtStrategy, 
        RtStrategy, 
        PrismaService
    ],
})
export class AuthModule {}

import { Body, Controller, Post } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { UserDTO } from "src/core/dtos/user.dto";
import { LoginService } from "src/service/login.service";

@Controller('login')
export class LoginController {
    constructor (private loginService: LoginService) {}

    @Post()
    login(@Body() body: UserDTO) {
        return this.loginService.authenticate(body);
    }
}
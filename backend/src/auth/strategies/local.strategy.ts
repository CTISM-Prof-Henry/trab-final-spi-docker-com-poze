import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'matricula',
        });
    }

    async validate(matricula: string, password: string) {
        const user = await this.authService.validateUser(matricula, password);
        if (!user) {
            throw new UnauthorizedException("Credenciais inválidas");
        }
        return user;
    }
}
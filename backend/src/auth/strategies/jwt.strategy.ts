import { Injectable } from "@nestjs/common";
import { Request } from "express";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

function cookieExtractor(req: Request) {
    return req?.cookies?.['access_token'] || null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: (req: Request) => {
                return cookieExtractor(req) || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
            },
            ignoreExpiration: false,
            secretOrKey: (() => {
                if (!process.env.JWT_ACCESS_SECRET) {
                    throw new Error('JWT_ACESS_SECRET environment variable is not set');
                }
                return process.env.JWT_ACCESS_SECRET;
            })(),
        });
    }

    async validate(payload: any) {
        return payload;
    }
}
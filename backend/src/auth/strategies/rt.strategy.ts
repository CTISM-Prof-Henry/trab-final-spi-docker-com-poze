import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

function refreshCookieExtractor(req: Request) {
    return req?.cookies?.['refresh_token'] || null;
}

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'rt') {
    constructor() {
        if (!process.env.JWT_REFRESH_SECRET) {
            throw new Error('JWT_REFRESH_SECRET environment variable is not set');
        }
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([refreshCookieExtractor]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_REFRESH_SECRET,
        });
    }

    async validate(payload: any) {
        return payload;
    }


}
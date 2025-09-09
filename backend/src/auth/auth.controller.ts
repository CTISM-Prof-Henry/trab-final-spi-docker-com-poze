import { Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import type { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { UserDTO } from "src/core/dtos/user.dto";
import { RtGuard } from "./guards/rt.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

function setAuthCookies(res: Response, at: string, rt: string) {
    const common = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
    };

    res.cookie('access_token', at, { ...common, maxAge: 1000 * 60 * 15 }); // 15 minutes
    res.cookie('refresh_token', rt, { ...common, maxAge: 1000 * 60 * 60 * 24 * 7 }); // 7 day
}

function clearAuthCookies(res: Response) {
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/' });
}

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const user = req.user as UserDTO;
        const tokens = await this.authService.login(user);

        setAuthCookies(res, tokens.access_token, tokens.refresh_token);

        return { user };
    }

    @UseGuards(RtGuard)
    @Post('refresh')
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const payload = req.user as UserDTO;
        const rt = req.cookies['refresh_token'];
        const tokens = await this.authService.refreshTokens(payload.id, rt);
        setAuthCookies(res, tokens.access_token, tokens.refresh_token);
        return { ok: true };
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async me(@Req() req: Request) {
        const { sub, matricula, tipo } = req.user as any;
        return { id: sub, matricula, tipo };
    
    }

    @UseGuards(LocalAuthGuard)
    @Post('logout')
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const { sub } = req.user as any;
        await this.authService.logout(sub);
        clearAuthCookies(res);
        return { ok: true };
    }
}
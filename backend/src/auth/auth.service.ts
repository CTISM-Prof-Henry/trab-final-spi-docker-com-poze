import { ForbiddenException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/database/prisma.service";
import * as bcrypt from 'bcrypt';
import { UserDTO } from "src/core/dtos/user.dto";
import { TipoUsuario } from "@prisma/client";

@Injectable()
export class AuthService {
    constructor(private prismaService: PrismaService, private jwtService: JwtService) {}

    async validateUser(matricula: string, passwordForm: string) {
        const user = await this.prismaService.user.findUnique({ where: { matricula } });
        
        if (!user) {
            return null;
        }

        const passwordsMatch = await bcrypt.compare(passwordForm, user.password);
        if (!passwordsMatch) {
            return null;
        }
        const { password, hashedRt, ...safe } = user;
        return safe;
    }

    async signTokens(userId: number, matricula: string, tipo: TipoUsuario) {
        const payload = {
            sub: userId,
            matricula: matricula,
            tipo: tipo
        };

        const [access_token, refresh_token] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_ACCESS_SECRET,
                expiresIn: '1d'
            }),
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: '7d'
            }),
        ]);

        return { access_token, refresh_token };
    }
    
    async updateRtHash(userId: number, rt: string) {
        const hash = await bcrypt.hash(rt, 10);
        await this.prismaService.user.update({
            where: { id: userId },
            data: { hashedRt: hash },
        });
    }

    async login(user: UserDTO) {
        const tokens = await this.signTokens(user.id!, user.matricula!, user.tipo!);
        await this.updateRtHash(user.id!, tokens.refresh_token);
        return tokens;
    }

    async refreshTokens(userId: number, refreshToken: string) {
        try {
            console.log(`Attempting refresh for user ${userId}`);
            
            const user = await this.prismaService.user.findUnique({ 
                where: { id: userId } 
            });
            
            if (!user) {
                console.log(`User ${userId} not found`);
                throw new ForbiddenException('User not found');
            }

            if (!user.hashedRt) {
                console.log(`No hashed RT for user ${userId}`);
                throw new ForbiddenException('No refresh token stored');
            }

            const rtMatches = await bcrypt.compare(refreshToken, user.hashedRt);
            if (!rtMatches) {
                console.log(`RT mismatch for user ${userId}`);
                await this.prismaService.user.update({
                    where: { id: userId },
                    data: { hashedRt: null },
                });
                throw new ForbiddenException('Refresh token mismatch');
            }

            const tokens = await this.signTokens(user.id, user.matricula, user.tipo);
            await this.updateRtHash(user.id, tokens.refresh_token);
            
            console.log(`Refresh successful for user ${userId}`);
            return tokens;
        } catch (error) {
            console.error('Refresh token error:', error);
            throw error;
        }
    }

    async logout(userId: number) {
        await this.prismaService.user.update({
            where: { id: userId },
            data: { hashedRt: null },
        });
    }
}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import * as dotenv from 'dotenv';
import path from 'path';
import { PrismaService } from './database/prisma.service';
import { UserModule } from './module/user.module';
import { LoginModule } from './module/login.module';
import { AuthModule } from './auth/auth.module';
import { CentroModule } from './module/centro.module';

dotenv.config({
  path: path.resolve(__dirname, '..', '.env'),
});

@Module({
  imports: [
    UserModule, 
    LoginModule, 
    AuthModule,
    CentroModule,
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}

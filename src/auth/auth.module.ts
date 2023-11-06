import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PostgresModule } from '../postgres/postgres.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';


@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [PostgresModule, JwtModule, PrismaModule]
})
export class AuthModule {}

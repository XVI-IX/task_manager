import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PostgresModule } from '../postgres/postgres.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';


@Module({
  controllers: [UserController],
  providers: [UserService, {
    provide: APP_GUARD,
    useClass: AuthGuard
  }],
  imports: [PostgresModule, JwtModule, PrismaModule]
})
export class UserModule {}

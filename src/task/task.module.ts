import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { ConfigModule } from '@nestjs/config';
import { PostgresModule } from '../postgres/postgres.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [TaskController],
  providers: [TaskService, {
    provide: APP_GUARD,
    useClass: AuthGuard
  }],
  imports: [
    ConfigModule, PostgresModule, JwtModule,
    PrismaModule
  ]
})
export class TaskModule {}

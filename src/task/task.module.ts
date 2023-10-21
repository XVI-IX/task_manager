import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { ConfigModule } from '@nestjs/config';
import { PostgresModule } from '../postgres/postgres.module';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  imports: [
    ConfigModule, PostgresModule
  ]
})
export class TaskModule {}

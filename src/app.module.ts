import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { PostgresModule } from './postgres/postgres.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserModule, TaskModule,
    PostgresModule, ConfigModule.forRoot({
      isGlobal: true
    })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

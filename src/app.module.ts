import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { ConfigModule } from '@nestjs/config';
import { PostgresModule } from './postgres/postgres.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaController } from './prisma/prisma.controller';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './categories/categories.module';
import { EmailModule } from './email/email.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SwaggerModule } from '@nestjs/swagger';

@Module({
  imports: [
    UserModule, TaskModule,
    PostgresModule, ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }), AuthModule, PrismaModule,
    CategoriesModule, EmailModule,
    EventEmitterModule.forRoot(),
    SwaggerModule
  ],
  controllers: [AppController, PrismaController],
  providers: [AppService, PrismaService],
})
export class AppModule {}

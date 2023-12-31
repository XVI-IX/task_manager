import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { PrismaModule } from '../prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  imports: [PrismaModule, JwtModule],
})
export class CategoriesModule {}

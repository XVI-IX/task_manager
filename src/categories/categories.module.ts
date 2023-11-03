import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, {
    provide: APP_GUARD,
    useClass: AuthGuard
  }],
  imports: [
    PrismaModule
  ]
})
export class CategoriesModule {}

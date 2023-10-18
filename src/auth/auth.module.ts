import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PostgresModule } from 'src/postgres/postgres.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [PostgresModule]
})
export class AuthModule {}

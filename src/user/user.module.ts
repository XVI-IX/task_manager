import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PostgresModule } from 'src/postgres/postgres.module';


@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [PostgresModule]
})
export class UserModule {}

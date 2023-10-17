import { Module } from '@nestjs/common';
import { PostgresController } from './postgres.controller';
import { Postgres } from './postgres';
import { PostgresService } from './postgres.service';

@Module({
  controllers: [PostgresController],
  providers: [Postgres, PostgresService]
})
export class PostgresModule {}

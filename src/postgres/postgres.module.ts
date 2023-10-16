import { Global, Module } from '@nestjs/common';
import { 
  ConfigurableDatabaseModule,
  CONNECTION_POOL,
  DATABASE_OPTIONS
} from './postgres.module-definition';
import { DatabaseOptions } from './databaseOptions.dto';
import { Pool } from 'pg';
import { PgService } from './postgres.service';

@Global()
@Module({
  imports: [PgService],
  exports: [PgService],
  providers: [
    PgService,
    {
      provide: CONNECTION_POOL,
      inject: [DATABASE_OPTIONS],
      useFactory: (databaseOptions: DatabaseOptions) => {
        return new Pool ({
          host: databaseOptions.host,
          port: databaseOptions.port,
          user: databaseOptions.user,
          password: databaseOptions.password,
          database: databaseOptions.database
        })
      }
    }
  ]
})
export class PostgresModule extends ConfigurableDatabaseModule {}

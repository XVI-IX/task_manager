import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Injectable()
export class PostgresService {
  private readonly logger = new Logger(PostgresService.name);
  private readonly pool: Pool;

  constructor(
    private config: ConfigService
  ) {
    this.pool = new Pool({
      user: this.config.DB_USERNAME,
      host: this.config.DB_HOST,
      database: this.config.DB_NAME,
      password: this.config.DB_PASSWORD,
      port: this.config.DB_PORT
    });
  }
}

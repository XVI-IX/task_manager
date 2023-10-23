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
      user: this.config.get("DB_USERNAME"),
      host: this.config.get("DB_HOST"),
      database: this.config.get('DB_NAME'),
      password: this.config.get('DB_PASSWORD'),
      port: this.config.get("DB_PORT")
    });
  }

  async query (text: string, values: any[] = []): Promise<any> {
    try {
      const result = await this.pool.query(text, values);
      return result;
    } catch (error) {
      this.logger.error(
        `Error executing query: ${error.message}`
      );
      throw error;
    }
  }

  async clean() {

    const text = 'DELETE FROM users; DELETE FROM tasks;'

    try{
      await this.query(text);

      console.log("Database cleared");

      return {
        message: 'Database Cleaned',
        success: true
      }
    } catch (error) {
      this.logger.error(
        `Error executing query: ${error.message}`
      )
      throw error;
    }
  }
}

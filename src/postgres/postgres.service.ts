import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Client } from "pg";

@Injectable()
export class PgService {
  private client: Client;

  constructor(
    private config: ConfigService
  ) {
    this.client = new Client({
      connectionString: this.config.get('DATABASE_URL')
    });

    this.client.connect();
  }
}
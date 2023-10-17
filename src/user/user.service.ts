import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PostgresService } from 'src/postgres/postgres.service';

@Injectable()
export class UserService {

  constructor(
    private config: ConfigService,
    private psql: PostgresService
  ) {
    
  }
}

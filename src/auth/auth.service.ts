import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PostgresService } from '../postgres/postgres.service';

import * as argon from 'argon2';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dtos/register.dto';


@Injectable()
export class AuthService {

  constructor(
    private config: ConfigService,
    private psql: PostgresService,
    private jwt: JwtService
  ) {

  }

  async register(dto: RegisterDto) {

    const hash = await argon.hash(dto.password);
    const query = `
    INSERT INTO users (username, password, email)
    VALUES ($1, $2, $3)`;
    const values = [dto.username, hash, dto.email];

    try{
      const user = await this.psql.query(query, values);

      return user;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async login(dto: LoginDto): Promise<{access_token: string}> {
    const query = `SELECT * FROM users WHERE email = $1`;
    const values = [dto.email];

    try {
      const user = await this.psql.query(query, values);
      const data = user.rows[0];

      if (!user) {
        throw new ForbiddenException("Invalid Credentials.");
      }
      
      const match = await argon.verify(data.password, dto.password)
      
      if (!match) {
        throw new ForbiddenException("Invalid Password");
      }

      const payload = {
        sub: data.user_id,
        email: data.email
      }

      const token = await this.jwt.signAsync(payload, {
        secret: this.config.get('SECRET'),
        expiresIn: this.config.get('EXPIRES_IN')
      });

      console.log(token);

      return {
        access_token: token
      };

    } catch (error) {
      throw new Error(error.message);
    }

  }

  async logout() {
    
  }
}

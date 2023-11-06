import { ForbiddenException, Injectable, InternalServerErrorException, Req, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PostgresService } from '../postgres/postgres.service';

import * as argon from 'argon2';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dtos/register.dto';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class AuthService {

  constructor(
    private config: ConfigService,
    private psql: PostgresService,
    private jwt: JwtService,
    private prisma: PrismaService
  ) {

  }

  private async getUserByEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: email
        },
        select: {
          user_id: true,
          username: true,
          email: true,
          password: true
        }
      })

      return user;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("Could not get user.");
    }
  }

  async register(dto: RegisterDto) {

    // const hash = await argon.hash(dto.password);
    // const query = `
    // INSERT INTO users (username, password, email)
    // VALUES ($1, $2, $3)`;
    // const values = [dto.username, hash, dto.email];

    // try{
    //   const user = await this.psql.query(query, values);

    //   return user;
    // } catch (error) {
    //   console.error(error);
    //   throw new Error(error.message);
    // }
    try {
      const hash = await argon.hash(dto.password);
      const user = await this.prisma.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          password: hash
        },
        select: {
          user_id: true,
          username: true
        }
      })

      return {
        message: "User created successfully",
        statusCode: 201,
        success: true,
        user
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("Could not register user");
    }
  }

  async login(dto: LoginDto): Promise<{access_token: string}> {
    try {
      const user = await this.getUserByEmail(dto.email);

      const match = await argon.verify(user.password, dto.password);

      if (!match) {
        throw new ForbiddenException("Invalid password")
      }

      const payload = {
        sub: user.user_id,
        email: user.email
      }

      const token = await this.jwt.signAsync(payload, {
        secret: this.config.get('SECRET'),
        expiresIn: this.config.get("EXPIRES_IN")
      });

      return {
        access_token: token
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("Could not login");
    }
  }

  async generateResetToken() {

  }

  async logout() {
    
  }

  async forgotPassword() {

  }

  async resetPassword() {

  }
}

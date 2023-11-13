import { ForbiddenException, Injectable, InternalServerErrorException, Req, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as argon from 'argon2';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dtos/register.dto';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes } from 'node:crypto';
import { EventEmitter2 } from '@nestjs/event-emitter';
// import { v4 as uui}

// const { randomBytes } = await import('node:crypto');


@Injectable()
export class AuthService {

  constructor(
    private config: ConfigService,
    private jwt: JwtService,
    private prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2
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
      });

      this.eventEmitter.emit('user.registered', user);

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

  async generateResetToken(): Promise<any> {
    try {
      const token = await randomBytes(256, (err, buff) => {
        if (err) {
          throw new InternalServerErrorException("Could not generate reset token")
        }

        const tokenString = buff.toString('hex');

        return tokenString;
      });

      return token;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        "Token not generated"
      );
    }
  }

  async logout() {
    
  }

  async forgotPassword(user_email: string) {
    try {
      const token = await this.generateResetToken();
      const expiryTime = Date.now() + (60 * 60 * 1000);

      const update = await this.prisma.user.update({
        where: {
          email: user_email
        },
        data: {
          resetToken: token,
          tokenExpiry: expiryTime
        }
      });


      this.eventEmitter.emit('user.resetPassword', update);

      return {
        message: "Reset Token Sent.",
        success: true,
        statusCode: 200
      }

    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        "Reset link could not be sent"
      )
    }

  }

  async resetPassword(
    password: string, user_email: string,
    token: string
    ) {
    try {
      
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("Password could not be reset")
    }

  }
}

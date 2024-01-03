import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as argon from 'argon2';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dtos/register.dto';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { StatusCodes } from 'http-status-codes';
import { Email } from 'src/email/entities/email.entity';
// import { v4 as uui}

// const { randomBytes } = await import('node:crypto');

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private jwt: JwtService,
    private prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private async getUserByEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
        select: {
          user_id: true,
          username: true,
          email: true,
          password: true,
        },
      });

      return user;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Could not get user.');
    }
  }

  async generateResetToken(payload: any): Promise<any> {
    try {
      const token = await this.jwt.signAsync(payload, {
        secret: this.config.get('RESET_SECRET'),
        expiresIn: Date.now() + 60 * 60 * 1000,
      });

      return token;

      // const token = await randomBytes(256, (err, buff) => {
      //   if (err) {
      //     throw new InternalServerErrorException("Could not generate reset token")
      //   }

      //   const tokenString = buff.toString('hex');

      //   return tokenString;
      // });

      // return token;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Token not generated');
    }
  }

  async register(dto: RegisterDto) {
    try {
      const hash = await argon.hash(dto.password);
      const user = await this.prisma.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          password: hash,
        },
        select: {
          user_id: true,
          username: true,
          email: true,
        },
      });

      const email: Email = {
        to: user.email,
        data: {
          username: user.username,
        },
      };

      this.eventEmitter.emit('user.registered', email);

      return {
        message: 'User created successfully',
        statusCode: StatusCodes.CREATED,
        success: true,
        user,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Could not register user');
    }
  }

  async login(dto: LoginDto): Promise<{ access_token: string }> {
    try {
      const user = await this.getUserByEmail(dto.email);

      const match = await argon.verify(user.password, dto.password);

      if (!match) {
        throw new ForbiddenException('Invalid password');
      }

      const payload = {
        sub: user.user_id,
        email: user.email,
      };

      const token = await this.jwt.signAsync(payload, {
        secret: this.config.get('SECRET'),
        expiresIn: this.config.get('EXPIRES_IN'),
      });

      return {
        access_token: token,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Could not login');
    }
  }

  async logout() {}

  async forgotPassword(user_email: string) {
    try {
      const user = await this.getUserByEmail(user_email);

      const token = await this.generateResetToken(user);

      const update = await this.prisma.user.update({
        where: {
          email: user_email,
        },
        data: {
          resetToken: token,
        },
      });

      const data: Email = {
        to: update.email,
        data: {
          username: update.username,
          resetToken: update.resetToken,
        },
      };

      this.eventEmitter.emit('user.resetPassword', data);

      return {
        message: 'Reset Token Sent.',
        success: true,
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Reset link could not be sent');
    }
  }

  async resetPassword(password: string, user_email: string, token: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: user_email,
        },
        select: {
          username: true,
          email: true,
          resetToken: true,
        },
      });

      const match = await this.jwt.verifyAsync(token, {
        secret: this.config.get('RESET_SECRET'),
      });

      if (!match) {
        throw new UnauthorizedException('Uauthorised to reset token.');
      }

      if (!user.resetToken) {
        throw new UnauthorizedException('Generate a reset token');
      }

      const hash = await argon.hash(password);

      const update = await this.prisma.user.update({
        where: {
          email: user_email,
        },
        data: {
          password: hash,
          resetToken: null,
        },
      });

      const data: Email = {
        to: user.email,
        data: {
          username: user.username,
        },
      };

      this.eventEmitter.emit('user.updatePassword', data);

      return {
        message: 'Password reset successfully',
        success: true,
        statusCode: StatusCodes.OK,
        update,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Password could not be reset');
    }
  }
}

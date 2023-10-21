import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private reflector: Reflector
    ) {}

  async canActivate(context: ExecutionContext): Promise<any> {

    // Check if route is public
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (isPublic) {
      return true
    }

    // Extract JWT token from inbound request object
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    // Verify the JWT token.
    try {
      const payload = await this.jwt.verifyAsync(
        token, {
          secret: this.config.get("SECRET")
        }
      );

      // Attach decoded payload to the request object.
      request['user'] = payload;
    } catch (error) {
      throw new Error(error.message)
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization.split(' ') ?? [];
    return type == 'Bearer' ? token : undefined;
  }
}
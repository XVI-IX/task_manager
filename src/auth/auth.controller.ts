import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Public } from '../decorators/public.decorator';


@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService
  ) {}

  // TODO: Create a new user account.
  @Post("register")
  @Public()
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // TODO: Log in to an exisiting user account
  @Post("login")
  @Public()
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // TODO: Log out of the current user account
  @UseGuards(AuthGuard)
  @Get("logout")
  async logout() {}
}

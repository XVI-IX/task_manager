import { Controller, Post, Get, Body, UseGuards, HttpCode, Redirect, Req } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Public } from '../decorators/public.decorator';
import { User } from 'src/decorators/user.decorator';


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
  @HttpCode(200)
  @Public()
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post("forgotPassword")
  @Public()
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  // TODO: Log out of the current user account
  @Get("logout")
  @UseGuards(AuthGuard)
  // @Redirect('auth/login', 200)
  async logout() {
    return this.authService.logout();
  }
}

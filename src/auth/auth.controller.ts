import { Controller, Post, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {

  // TODO: Create a new user account.
  @Post("register")
  async register() {}

  // TODO: Log in to an exisiting user account
  @Post("login")
  async login() {}

  // TODO: Log out of the current user account
  @Get("logout")
  async logout() {}
}

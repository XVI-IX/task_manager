import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UserController {

  //TODO: Get the current user's profile information
  @Get('profile')
  async getProfile() {}
}

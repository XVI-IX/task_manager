import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../decorators/user.decorator';

@Controller()
export class UserController {

  constructor(
    private userService: UserService,
  ) {}

  //TODO: Get the current user's profile information
  @Get('profile')
  async getProfile(@User() user) {
    return this.userService.profile(user.email);
  }


  @Get('dashboard')
  async getDashboard(@User() user) {
    return this.userService.dashboard(user.email);
  }
}

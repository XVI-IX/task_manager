import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../decorators/user.decorator';
import { Public } from '../decorators/public.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  //TODO: Get the current user's profile information
  @Get('profile')
  async getProfile(@User() user) {
    return this.userService.getProfile(user.email);
  }

  @Get('dashboard')
  async getDashboard(@User() user) {
    return this.userService.getDashboard(user.email);
  }

  @Public()
  @Get('test')
  async testUser(): Promise<any> {
    return this.userService.testUser();
  }
}

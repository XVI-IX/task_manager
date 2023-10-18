import { Controller, Get, Req } from '@nestjs/common';
import { RegisterDto } from 'src/auth/dtos/register.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {

  constructor(
    private userService: UserService,
  ) {}

  //TODO: Get the current user's profile information
  @Get('profile')
  async getProfile(@Req() req: Request) {
    return this.userService.profile(req);
  }


  @Get('dashboard')
  async getDashboard() {
    return this.userService.dashboard();
  }
}

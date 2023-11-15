import { Controller, Post, Get, Body, UseGuards, HttpCode, Redirect, Req, Query } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Public } from '../decorators/public.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags("Auth")
@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService
  ) {}

  // TODO: Create a new user account.
  @Post("register")
  @Public()
  @ApiResponse({
    status: 200,
    description: "Route to register user"
  })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // TODO: Log in to an exisiting user account
  @Post("login")
  @HttpCode(200)
  @Public()
  @ApiResponse({
    status: 200,
    description: "Route to login registered user."
  })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post("forgotPassword")
  @HttpCode(200)
  @Public()
  @ApiResponse({
    status: 200,
    description: "Route to submit email for reset token to be sent.",
    // examples: {
    //   'application/json': {
    //     email: 'email@example.com'
    //   }
    // }
  })
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post("resetPassword")
  @Public()
  @ApiResponse({
    status: 200,
    description: "Route to submit new password to the api",
  })
  async resetPassword(@Body() body, @Query('token') token: string){
    return this.authService.resetPassword(
      body.password, body.email,token
    );
  }

  // TODO: Log out of the current user account
  @Get("logout")
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: "Logout route."
  })
  // @Redirect('auth/login', 200)
  async logout() {
    return this.authService.logout();
  }
}

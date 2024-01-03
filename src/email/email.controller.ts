import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { Email } from './entities/email.entity';
import { Public } from '../decorators/public.decorator';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Public()
  @Get('testmail')
  async testMail() {
    const email: Email = {
      to: 'ojebiyidaviddaniel@gmail.com',
      data: {
        username: 'xviix',
      },
    };

    return this.emailService.testEmail(email);
  }
}

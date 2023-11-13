import { Injectable } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { Email } from './entities/email.entity';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {

  }

  async welcomeEmail(email: Email) {
    const { data } = email;
    const subject = `Welcome ${data.username}`;

    await this.mailerService.sendMail({
      to: email.to,
      subject,
      template: './welcome',
      context: {
        name: data.username
      }
    })
  }

  @OnEvent('user.registered')
  handleUserRegisteredEvent(data: any) {
    this.welcomeEmail({
      to: data.email,
      data: {
        name: data.username
      }
    })
  }
}

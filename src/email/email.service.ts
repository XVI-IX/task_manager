import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { Email } from './entities/email.entity';
import { OnEvent } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private configService: ConfigService
    ) {

  }

  async welcomeEmail(email: Email) {
    const { data } = email;
    console.log(data);
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

  async resetPasswordEmail(email: Email) {
    const { data } = email;
    const subject = "Password Reset Token";
    const tokenUrl = `${this.configService.get("URL")}/auth/resetPassword?token=${data.resetToken}`;

    console.log(tokenUrl);

    await this.mailerService.sendMail({
      to: email.to,
      subject,
      template: './resetToken',
      context: {
        name: data.username,
        tokenUrl: tokenUrl
      }
    })
  }

  async testEmail(email: Email) {
    try {
      const { data } = email;
      const subject = `Test Email`;

      console.log(process.env.EMAIL_PORT)

      await this.mailerService.sendMail({
        to: email.to,
        subject,
        template: './testmail',
        context: {
          name: data.username
        }
      })
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException("Could not send mail")
    }
  }

  async updatePasswordEmail( email: Email ) {
    const { data } = email;
    const subject = "Your password was reset."

    await this.mailerService.sendMail({
      to: email.to,
      subject,
      template: "./updateMail",
      context: {
        name: data.username
      }
    })
  }

  @OnEvent('user.registered')
  handleUserRegisteredEvent(data: any) {
    this.welcomeEmail(data);
  }

  @OnEvent('user.resetPassword')
  handleResetPasswordEvent(data: any) {
    this.resetPasswordEmail(data);
  }

  @OnEvent('user.updatePassword')
  handleUpdatePasswordEvent(data: any) {
    this.updatePasswordEmail(data)
  }
}

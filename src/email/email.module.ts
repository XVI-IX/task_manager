import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Module({
  controllers: [EmailController],
  providers: [EmailService],
  imports: [
    MailerModule.forRoot({
      transport: {
        host: '<host>',
        port: Number('<port>'),
        secure: false,
        auth: {
          user: '<>',
          pass: ''
        },
      },
      defaults: {
        from: 'David-Daniel at oladoja14@gmail.com'
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new EjsAdapter()
      },
    }),
  ],  
})
export class EmailModule {}

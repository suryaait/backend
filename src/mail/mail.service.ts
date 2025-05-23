import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { join } from 'path';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(email: string, name: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Our App!',
      template: 'welcome',
      context: {
        name,
      },
      attachments: [
        {
          filename: 'sample.pdf',
          path: join(__dirname, 'attachments/sample.pdf'),
        },
        {
          filename: 'download.jpg',
          path: join(__dirname, 'attachments/download.jpg'),
          cid: 'logo@cid',
        },
      ],
    });
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter, SendMailOptions } from 'nodemailer';

@Injectable()
export class MailService {
  logger = new Logger(MailService.name);
  private transporter: Transporter;
  constructor(private readonly configService: ConfigService) {
    this.transporter = createTransport({
      host: 'mail.privateemail.com',
      port: 465,
      secure: true,
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    });
  }

  async sendMail({ email, subject, template }) {
    if (this.configService.get('NODE_ENV') === 'development') {
      this.logger.log('not sending email due to NODE_ENV == development');
      return;
    }
    try {
      const payload: SendMailOptions = {
        to: email,
        from: this.configService.get('EMAIL_USER'),
        subject,
        html: template,
        sender: this.configService.get('EMAIL_USER'),
      };
      const res = await this.transporter.sendMail(payload);
      return res;
    } catch (e) {
      this.logger.error(e);
    }
  }

  async sendMailSimple(subject: string, text: string) {
    try {
      const res = await this.transporter.sendMail({
        to: this.configService.get('EMAIL_USER'),
        from: this.configService.get('EMAIL_USER'),
        subject,
        text,
      });
      return res;
    } catch (e) {
      console.error(e);
    }
  }
}

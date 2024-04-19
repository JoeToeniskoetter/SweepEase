import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class MailService {
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
    try {
      const res = await this.transporter.sendMail({
        to: email,
        from: this.configService.get('EMAIL_USER'),
        subject,
        html: template,
      });
      return res;
    } catch (e) {
      console.error(e);
    }
  }
}

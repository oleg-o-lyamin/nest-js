import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async send(
    email: string,
    changes: { key: string; old: string; new: string }[],
  ) {
    return this.mailerService
      .sendMail({
        to: `${email}`,
        subject: 'Изменения',
        template: './changes',
        context: { changes: changes },
      })
      .then((res) => {
        console.log('res', res);
      })
      .catch((err) => {
        console.log('err', err);
      });
  }
}

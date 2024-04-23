import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbacKRepo: Repository<Feedback>,
    private readonly mailService: MailService,
  ) {}

  async create(createFeedbackDto: CreateFeedbackDto, currentUser: User) {
    const feedback = this.feedbacKRepo.create({
      feedback: createFeedbackDto.feedback,
      user: currentUser,
    });
    await this.feedbacKRepo.save(feedback);
    try {
      this.mailService.sendMailSimple(
        'FEEDBACK',
        `USER: ${currentUser.email} \n FEEDBACK: ${createFeedbackDto.feedback}`,
      );
    } catch (e) {
      console.error(e);
    }
  }
}

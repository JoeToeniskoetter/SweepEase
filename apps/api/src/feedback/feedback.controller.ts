import { Body, Controller, Post } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FeedbackService } from './feedback.service';
import { CurrentUser } from 'src/user/user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  create(
    @Body() createFeedbackDto: CreateFeedbackDto,
    @CurrentUser() user: User,
  ) {
    return this.feedbackService.create(createFeedbackDto, user);
  }
}

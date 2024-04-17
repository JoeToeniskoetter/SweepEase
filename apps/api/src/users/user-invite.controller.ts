import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { FirebaseAuthGuard } from 'src/firebase/firebase.guard';
import { CurrentUser } from 'src/user/user.decorator';
import { User } from './entities/user.entity';
import { CreateUserInviteDto } from './dto/create-user-invite.dto';

@UseGuards(FirebaseAuthGuard)
@Controller('user-invite')
export class UserInviteController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createInvite(
    @CurrentUser() user: User,
    @Body() createInviteDto: CreateUserInviteDto,
  ) {
    return this.usersService.createUserInvite(user, createInviteDto);
  }

  @Get()
  findInvites(@CurrentUser() user: User) {
    return this.usersService.findAllInvitesForCompany(user);
  }
}

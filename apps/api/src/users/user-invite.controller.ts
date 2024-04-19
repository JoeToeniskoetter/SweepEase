import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/user/user.decorator';
import { User, UserRoles } from './entities/user.entity';
import { CreateUserInviteDto } from './dto/create-user-invite.dto';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import { Roles } from 'src/role/roles.decorator';

@Controller('user-invite')
export class UserInviteController {
  constructor(private readonly usersService: UsersService) {}

  @Roles([UserRoles.CREATOR])
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

  @Post('accept')
  acceptInvite(
    @CurrentUser() currentUser: User,
    @Body() acceptInviteDto: AcceptInviteDto,
  ) {
    return this.usersService.acceptInvite(currentUser, acceptInviteDto);
  }
}

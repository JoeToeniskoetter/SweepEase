import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/user/user.decorator';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  findAll(@CurrentUser() currentUser: User) {
    return this.usersService.getMe(currentUser);
  }

  @Get()
  findAllForCompany(@CurrentUser() currentUser: User) {
    return this.usersService.findAllForCompany(currentUser);
  }

  @Patch(':id')
  updateUser(
    @CurrentUser() currentUser: User,
    @Body() updateUserDto: UpdateUserDto,
    @Param('id') id: string,
  ) {
    return this.usersService.updateUser(currentUser, updateUserDto, id);
  }

  @Post('/complete-first-login')
  completeFirstLogin(@CurrentUser() currentUser: User) {
    return this.usersService.completeFirstLogin(currentUser);
  }
}

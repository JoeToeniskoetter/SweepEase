import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateUserInviteDto } from './dto/create-user-invite.dto';
import { UserInvite } from './entities/user-invite.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(UserInvite)
    private readonly userInviteRepo: Repository<UserInvite>,
    private readonly jwtService: JwtService,
  ) {}
  async getMe(currentUser: User) {
    return this.userRepo.findOne({
      where: { id: currentUser.id },
      relations: ['company'],
    });
  }
  async findAllForCompany(currentUser: User) {
    return this.userRepo.find({
      where: {
        company: { id: currentUser.company.id },
        email: Not(currentUser.email),
      },
    });
  }

  async findAllInvitesForCompany(currentUser: User) {
    return this.userInviteRepo.find({
      where: {
        company: { id: currentUser.company.id },
      },
      select: ['id', 'company', 'createdAt', 'userEmail'],
    });
  }
  async createUserInvite(user: User, createInviteDto: CreateUserInviteDto) {
    //check if user already associated with a company
    const exisitingUser = await this.userRepo.findOne({
      where: { email: createInviteDto.email.toLowerCase() },
    });
    if (exisitingUser) {
      throw new BadRequestException('user already associated to company');
    }
    //check if user already invited
    const existingInvite = await this.userInviteRepo.findOne({
      where: { userEmail: createInviteDto.email.toLowerCase() },
    });
    if (existingInvite) {
      throw new BadRequestException('user already invited');
    }
    //create invite in db
    const verificationCode = this.jwtService.sign({ company: user.company.id });
    const entity = this.userInviteRepo.create({
      userEmail: createInviteDto.email,
      createdBy: user,
      company: user.company,
      expiresAt: new Date(),
      verificationCode: verificationCode,
    });

    //send email with invite link
    //need to setup email templates
    return this.userInviteRepo.save(entity);
  }
}

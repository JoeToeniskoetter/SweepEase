import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository } from 'typeorm';
import { CreateUserInviteDto } from './dto/create-user-invite.dto';
import { UserInvite } from './entities/user-invite.entity';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import dataSource from 'src/db/data-source';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(UserInvite)
    private readonly userInviteRepo: Repository<UserInvite>,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
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

  async acceptInvite(currentUser: User, acceptInviteDto: AcceptInviteDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const payload = await this.jwtService.verify(acceptInviteDto.code);
      const invite = await this.userInviteRepo.findOne({
        where: {
          company: { id: payload.company },
          verificationCode: acceptInviteDto.code,
          userEmail: currentUser.email,
        },
      });

      if (!invite) {
        throw new BadRequestException('failed to verify invite');
      }

      if (payload.company) {
        const user = this.userRepo.create({
          ...currentUser,
          company: { id: payload.company },
        });
        await queryRunner.manager.save(user);
        await queryRunner.manager.remove(invite);
        await queryRunner.commitTransaction();
      }
    } catch (e) {
      await queryRunner.rollbackTransaction();
      if (e instanceof JsonWebTokenError) {
        throw new BadRequestException('failed to verify invite');
      } else {
        throw e;
      }
    } finally {
      await queryRunner.release();
    }
  }
}

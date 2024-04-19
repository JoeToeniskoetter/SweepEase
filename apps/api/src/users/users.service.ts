import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateUserInviteDto } from './dto/create-user-invite.dto';
import { UserInvite } from './entities/user-invite.entity';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import { MailService } from 'src/mail/mail.service';
import { renderCompanyInviteEmail } from 'src/mail/templates/company-invite';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(UserInvite)
    private readonly userInviteRepo: Repository<UserInvite>,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
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
    if (exisitingUser && exisitingUser.company) {
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
    const verificationCode = this.jwtService.sign(
      { company: user.company.id },
      { expiresIn: '1 day' },
    );
    const entity = this.userInviteRepo.create({
      userEmail: createInviteDto.email,
      createdBy: user,
      company: user.company,
      expiresAt: new Date(),
      verificationCode: verificationCode,
    });
    const res = await this.mailService.sendMail({
      email: createInviteDto.email,
      subject: `Join SweepInspectr with ${user.company.name}`,
      template: renderCompanyInviteEmail({
        link:
          this.configService.get('NODE_ENV') === 'development'
            ? `http://localhost:5173/invite?code=${verificationCode}`
            : `https://sweep-inspectr.com/invite?code=${verificationCode}`,
        companyName: user.company.name,
      }),
    });
    this.logger.log(res);

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
        await queryRunner.manager.softDelete(UserInvite, { id: invite.id });
        await queryRunner.commitTransaction();
      }
    } catch (e) {
      await queryRunner.rollbackTransaction();
      if (e instanceof JsonWebTokenError) {
        if (e instanceof TokenExpiredError) {
          throw new BadRequestException('This invite has expired');
        }
        throw new BadRequestException('Failed to verify invite');
      } else {
        throw e;
      }
    } finally {
      await queryRunner.release();
    }
  }

  async updateUser(
    currentUser: User,
    updateUserDto: UpdateUserDto,
    id: string,
  ) {
    const userToUpdate = await this.userRepo.findOne({
      where: { id: id, company: { id: currentUser.company.id } },
    });

    if (!userToUpdate) {
      throw new NotFoundException('user not found');
    }

    if (updateUserDto.role !== 'USER' && updateUserDto.role !== 'ADMIN') {
      throw new BadRequestException(
        'role updates are only allow for user and admin roless',
      );
    }

    userToUpdate.role = updateUserDto.role;
    return this.userRepo.save(userToUpdate);
  }

  private async sendInviteEmail(
    verificationCode: string,
    email: string,
    companyName: string,
  ) {
    const res = await this.mailService.sendMail({
      email: email,
      subject: `Join SweepInspectr with ${companyName}`,
      template: renderCompanyInviteEmail({
        link:
          this.configService.get('NODE_ENV') === 'development'
            ? `http://localhost:5173/invite?code=${verificationCode}`
            : `https://sweep-inspectr.com/invite?code=${verificationCode}`,
        companyName: companyName,
      }),
    });
    return res;
  }

  async resendInvite(id: string, currentUser: User) {
    const invite = await this.userInviteRepo.findOne({
      where: { id, company: { id: currentUser.company.id } },
    });

    if (!invite) {
      throw new NotFoundException();
    }

    const verificationCode = this.jwtService.sign(
      { company: currentUser.company.id },
      { expiresIn: '1 day' },
    );

    const res = await this.sendInviteEmail(
      verificationCode,
      invite.userEmail,
      currentUser.company.name,
    );

    this.logger.log(res);
  }
}

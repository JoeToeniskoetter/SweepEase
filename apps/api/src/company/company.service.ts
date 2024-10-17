import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { User, UserRoles } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { DataSource, Repository } from 'typeorm';
import { FirebaseAuthGuard } from 'src/firebase/firebase.guard';
import { UploadService } from 'src/upload/upload.service';
import { v4 as uuid } from 'uuid';

@Injectable()
@UseGuards(FirebaseAuthGuard)
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private dataSource: DataSource,
    private readonly uploadService: UploadService,
  ) {}
  async create(
    createCompanyDto: CreateCompanyDto,
    currentUser: User,
    logo?: Express.Multer.File,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const existingCompany = await this.userRepo.findOne({
      where: { id: currentUser.id },
      relations: ['company'],
    });

    if (existingCompany.company !== null) {
      throw new BadRequestException({
        message: 'user already connected to company',
      });
    }

    const { name, address, city, state, zip, phone } = createCompanyDto;
    const id = uuid();
    const company = this.companyRepo.create({
      id,
      name,
      address,
      city,
      state,
      zip,
      phone,
      createdBy: currentUser,
    });

    if (logo) {
      const uploadedLogoUrl = await this.uploadService.upload(logo, id);
      company.logo = uploadedLogoUrl;
    }

    try {
      const newCompany = await queryRunner.manager.save(company);
      currentUser.company = newCompany;
      currentUser.role = UserRoles.CREATOR;
      await queryRunner.manager.save(currentUser);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async findOneForUser(user: User, id: string) {
    if (user.company.id !== id) {
      throw new UnauthorizedException();
    }
    const company = await this.companyRepo.findOne({ where: { id: id } });
    if (company.logo) {
      company.logo = await this.uploadService.getUrl(company.logo);
    }
    return company;
  }
}

import { BadRequestException, Injectable, UseGuards } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { DataSource, Repository } from 'typeorm';
import { FirebaseAuthGuard } from 'src/firebase/firebase.guard';

@Injectable()
@UseGuards(FirebaseAuthGuard)
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private dataSource: DataSource,
  ) {}
  async create(createCompanyDto: CreateCompanyDto, currentUser: User) {
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

    const company = this.companyRepo.create({
      ...createCompanyDto,
      createdBy: currentUser,
    });

    try {
      const newCompany = await queryRunner.manager.save(company);
      currentUser.company = newCompany;
      currentUser.role = 'ADMIN';
      await queryRunner.manager.save(currentUser);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  update(id: string, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }
}

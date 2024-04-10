import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { InspectionTemplate } from './entities/inspection_template.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { InspectionTemplateItem } from './entities/inspection_template_items.entity';
import { InspectionTemplateOptions } from './entities/inspection_template_options.entity';

@Injectable()
export class InspectionService {
  logger: Logger = new Logger(InspectionService.name);
  constructor(
    private dataSource: DataSource,
    @InjectRepository(InspectionTemplate)
    private readonly inspectionTemplateRepo: Repository<InspectionTemplate>,
    @InjectRepository(InspectionTemplateItem)
    private readonly inspectionTemplateItemRepo: Repository<InspectionTemplateItem>,
    @InjectRepository(InspectionTemplateOptions)
    private readonly inspectionTemplateOptionsRepo: Repository<InspectionTemplateOptions>,
  ) {}

  findAllTemplates(currentUser: User) {
    return this.inspectionTemplateRepo.find({
      where: { company: { id: currentUser.company.id } },
    });
  }

  createTemplate(createTemplateDto: CreateTemplateDto, currentUser: User) {
    const company = currentUser.company;

    const template = this.inspectionTemplateRepo.create({
      company,
      createdBy: currentUser,
      inspectionLevel: 'Level One',
      name: createTemplateDto.name,
    });

    return this.inspectionTemplateRepo.save(template);
  }

  findTemplateById(id: string) {
    return this.inspectionTemplateRepo.findOne({
      where: { id },
      relations: ['items', 'items.options'],
    });
  }

  async updateTemplate(
    id: string,
    updateTemplateDto: UpdateTemplateDto,
    currentUser: User,
  ) {
    this.logger.debug(updateTemplateDto);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const template = this.inspectionTemplateRepo.create({
        id: id,
        name: updateTemplateDto.name,
        inspectionLevel: updateTemplateDto.inspectionLevel,
      });
      await queryRunner.manager.save(template);
      const newItems = updateTemplateDto.items.map((item) => {
        const newOptions = item.options.map((o) => {
          return this.inspectionTemplateOptionsRepo.create({
            ...(o.id && { id: o.id }),
            name: o.name,
            description: o.description,
          });
        });
        const newItem = this.inspectionTemplateItemRepo.create({
          ...(item.id && { id: item.id }),
          name: item.name,
          template: { id },
          options: newOptions,
        });

        return newItem;
      });
      // await queryRunner.manager.delete(InspectionTemplateOptions, { id });
      await queryRunner.manager.delete(InspectionTemplateItem, {
        template: { id },
      });

      await queryRunner.manager.save(newItems);
      await queryRunner.commitTransaction();
    } catch (e) {
      console.log(e);
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      console.log('release runner');
      await queryRunner.release();
    }
  }

  async deleteTemplate(id: string, user: User) {
    const company = user.company;
    const template = await this.inspectionTemplateRepo.findOne({
      where: { company: { id: company.id }, id },
    });
    if (!template) {
      throw new NotFoundException();
    }
    return this.inspectionTemplateRepo.softDelete({ id: template.id });
  }

  create(createInspectionDto: CreateInspectionDto) {
    return 'This action adds a new inspection';
  }

  findAll() {
    return `This action returns all inspection`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inspection`;
  }

  update(id: number, updateInspectionDto: UpdateInspectionDto) {
    return `This action updates a #${id} inspection`;
  }

  remove(id: number) {
    return `This action removes a #${id} inspection`;
  }
}

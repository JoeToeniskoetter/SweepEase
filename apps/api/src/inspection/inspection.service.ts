import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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
import { Inspection } from './entities/inspection.entity';
import { InspectionDetail } from './entities/inspection_detail.entity';
import { updateInspectionDetailItem } from './dto/update-inspection-detail-item';
import { UploadService } from 'src/upload/upload.service';
import { InspectionSignature } from './entities/inspection_signature.entity';

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
    @InjectRepository(Inspection)
    private readonly inspectionRepo: Repository<Inspection>,
    @InjectRepository(InspectionSignature)
    private readonly inspectionSignatureRepo: Repository<InspectionSignature>,
    @InjectRepository(InspectionDetail)
    private readonly inspectionDetailRepo: Repository<InspectionDetail>,
    private readonly uploadService: UploadService,
  ) {}

  async completeInspection(
    currentUser: User,
    id: string,
    signatures: Express.Multer.File[],
  ) {
    const company = currentUser.company;
    const inspection = await this.inspectionRepo.findOne({
      where: { company: { id: company.id }, id: id },
    });

    if (!inspection) {
      throw new NotFoundException();
    }

    const uploadedSignatures = await Promise.all(
      signatures.map(async (sig) => {
        const imageUrl = await this.uploadService.upload(sig, id);
        return this.inspectionSignatureRepo
          .create({
            inspection: inspection,
            imageUrl: imageUrl,
            type: sig.originalname,
          })
          .save();
      }),
    );

    inspection.signatures = uploadedSignatures;
    inspection.status = 'COMPLETE';
    await this.inspectionRepo.save(inspection);
    return inspection;
  }

  async findInspectionDetails(id: string, currentUser: User) {
    const details = await this.inspectionDetailRepo.find({
      where: { inspection: { id, company: { id: currentUser.company.id } } },
      order: { position: 'ASC' },
    });
    if (details.length == 0) {
      throw new NotFoundException();
    }

    const newDetails = Promise.all(
      details.map(async (detail) => {
        if (detail.photoUrl) {
          const url = await this.uploadService.getUrl(detail.photoUrl);
          return {
            ...detail,
            photoUrl: url,
          };
        }
        return detail;
      }),
    );

    return newDetails;
  }

  async updateInspectionDetailItem(
    inspectionId: string,
    itemId: string,
    body: updateInspectionDetailItem,
    photo: Express.Multer.File,
  ) {
    const detail = await this.inspectionDetailRepo.findOne({
      where: { id: itemId, inspection: { id: inspectionId } },
    });
    if (!detail) {
      throw new NotFoundException();
    }

    detail.condition = body.condition;
    detail.notes = body.notes;
    detail.isComplete = true;

    if (photo) {
      const photoUrl = await this.uploadService.upload(photo, itemId);
      detail.photoUrl = photoUrl;
    }

    await this.inspectionDetailRepo.save(detail);
    detail.photoUrl = await this.uploadService.getUrl(detail.photoUrl);
    return detail;
  }

  async startInspection(id: string, user: User) {
    const company = user.company;
    const inspection = await this.inspectionRepo.findOne({
      where: { id, company: { id: company.id } },
      relations: ['template'],
    });

    if (!inspection) {
      throw new NotFoundException();
    }

    if (inspection.status !== 'NEW') {
      throw new BadRequestException({
        message: 'inspection must be in new status',
      });
    }

    //get all items for assigned inspection template
    const template = await this.inspectionTemplateRepo.findOne({
      where: { id: inspection.template.id },
      relations: ['items', 'items.options'],
    });

    if (template.items.length == 0) {
      throw new BadRequestException({
        message: 'assigned template does not have inspection items',
      });
    }

    //insert each items as a line item in inspection details table
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const detailItems = template.items.map((i) => {
        const detail = this.inspectionDetailRepo.create({
          inspection: { id: inspection.id },
          item: i.name,
          position: i.position,
          options: i.options.map((o) => ({
            name: o.name,
            description: o.description,
          })),
          notes: '',
          startedBy: { id: user.id },
          photoUrl: '',
        });
        return detail;
      });
      await queryRunner.manager.save(detailItems);
      await this.inspectionRepo.update(
        { id: inspection.id },
        { status: 'IN PROGRESS' },
      );
      await queryRunner.commitTransaction();
    } catch (e) {
      queryRunner.rollbackTransaction();
      this.logger.error(e);
      throw new InternalServerErrorException({ message: e });
    } finally {
      queryRunner.release();
    }
  }

  findAllInspectionTemplateOptions(currentUser: User) {
    return this.inspectionTemplateRepo.find({
      where: { company: { id: currentUser.company.id } },
      select: ['id', 'inspectionLevel', 'name'],
    });
  }

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
      order: { items: { position: 'ASC' } },
    });
  }

  async updateTemplate(
    id: string,
    updateTemplateDto: UpdateTemplateDto,
    currentUser: User,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const template = await this.inspectionTemplateRepo.findOne({
        where: { id: id, company: { id: currentUser.company.id } },
      });
      template.name = updateTemplateDto.name;
      template.inspectionLevel = updateTemplateDto.inspectionLevel;
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
          position: item.position,
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

  async create(createInspectionDto: CreateInspectionDto, currentUser: User) {
    const inspectionOrder = this.inspectionRepo.create({
      ...createInspectionDto,
      status: 'NEW',
      template: { id: createInspectionDto.templateId },
      user: currentUser,
      company: currentUser.company,
    });
    const newInsp = await this.inspectionRepo.save(inspectionOrder);
    return await this.inspectionRepo.findOne({
      where: { id: newInsp.id },
      relations: ['template'],
    });
  }

  findAll(currentUser: User) {
    return this.inspectionRepo.find({
      where: { company: { id: currentUser.company.id } },
      relations: ['template'],
    });
  }

  async findOne(id: string, currentUser: User) {
    const inspection = await this.inspectionRepo.findOne({
      where: { company: { id: currentUser.company.id }, id: id },
      relations: [
        'template',
        'template.items',
        'template.items.options',
        'signatures',
      ],
    });
    if (!inspection) {
      throw new NotFoundException();
    }

    if (inspection.signatures.length > 0) {
      inspection.signatures = await Promise.all(
        inspection.signatures.map(async (sig) => {
          sig.imageUrl = await this.uploadService.getUrl(sig.imageUrl);
          return sig;
        }),
      );
    }

    return inspection;
  }

  update(id: number, updateInspectionDto: UpdateInspectionDto) {
    return `This action updates a #${id} inspection`;
  }

  remove(id: number) {
    return `This action removes a #${id} inspection`;
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { InspectionService } from './inspection.service';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { CurrentUser } from 'src/user/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { FirebaseAuthGuard } from 'src/firebase/firebase.guard';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { updateInspectionDetailItem } from './dto/update-inspection-detail-item';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@UseGuards(FirebaseAuthGuard)
@Controller('inspection')
export class InspectionController {
  constructor(private readonly inspectionService: InspectionService) {}

  @Post('/start/:id')
  startInspection(@Param('id') id: string, @CurrentUser() user: User) {
    this.inspectionService.startInspection(id, user);
  }

  @Post('/details/:inspectionId/item/:itemId')
  @UseInterceptors(FileInterceptor('photo'))
  updateInspectionDetailItem(
    @CurrentUser() user: User,
    @Param('inspectionId') inspectionId: string,
    @Param('itemId') itemId: string,
    @Body() body: updateInspectionDetailItem,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp)$/,
          }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.inspectionService.updateInspectionDetailItem(
      inspectionId,
      itemId,
      body,
      file,
    );
  }

  @Post('/:id/complete')
  @UseInterceptors(FilesInterceptor('signatures'))
  completeInspection(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @UploadedFiles() signatures: Array<Express.Multer.File>,
  ) {
    console.log();
    if (signatures.length < 1) {
      throw new BadRequestException(
        'signatures for customer and technician must be included',
      );
    }

    if (
      !signatures.find((f) => f.originalname === 'technician-signature.png') ||
      !signatures.find((f) => f.originalname === 'customer-signature.png')
    ) {
      throw new BadRequestException(
        'signatures for customer and technician must be included',
      );
    }

    this.inspectionService.completeInspection(user, id, signatures);
  }

  @Post()
  create(
    @Body() createInspectionDto: CreateInspectionDto,
    @CurrentUser() user: User,
  ) {
    return this.inspectionService.create(createInspectionDto, user);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.inspectionService.findAll(user);
  }
  @Get('/details/:id')
  findInspectionDeatils(
    @Param('id') id: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.inspectionService.findInspectionDetails(id, currentUser);
  }

  @Get('/templates')
  findAllTemplates(@CurrentUser() currentUser: User) {
    return this.inspectionService.findAllTemplates(currentUser);
  }

  @Get('/template-options')
  findAllTemplateOptions(@CurrentUser() currentUser: User) {
    return this.inspectionService.findAllInspectionTemplateOptions(currentUser);
  }

  @Post('/templates')
  createInspectionTemplate(
    @Body() createTemplateDto: CreateTemplateDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.inspectionService.createTemplate(
      createTemplateDto,
      currentUser,
    );
  }

  @Get('/templates/:id')
  findOneTemplate(@Param('id') id: string) {
    return this.inspectionService.findTemplateById(id);
  }

  @Patch('/templates/:id')
  updateTemplate(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ) {
    return this.inspectionService.updateTemplate(id, updateTemplateDto, user);
  }

  @Delete('/templates/:id')
  deleteTemplate(@CurrentUser() user: User, @Param('id') id: string) {
    return this.inspectionService.deleteTemplate(id, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.inspectionService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInspectionDto: UpdateInspectionDto,
  ) {
    return this.inspectionService.update(+id, updateInspectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inspectionService.remove(+id);
  }
}

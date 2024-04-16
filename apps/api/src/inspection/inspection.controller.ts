import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Logger,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FirebaseAuthGuard } from 'src/firebase/firebase.guard';
import { CurrentUser } from 'src/user/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { InspectionService } from './inspection.service';

@UseGuards(FirebaseAuthGuard)
@Controller('inspection')
export class InspectionController {
  logger = new Logger(InspectionController.name);
  constructor(private readonly inspectionService: InspectionService) {}

  @Post('/start/:id')
  startInspection(@Param('id') id: string, @CurrentUser() user: User) {
    this.logger.log('staring inspection');
    this.inspectionService.startInspection(id, user);
  }

  @Post('/:id/complete')
  @UseInterceptors(FilesInterceptor('signatures'))
  completeInspection(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp)$/,
          }),
        ],
        fileIsRequired: false,
      }),
    )
    signatures: Array<Express.Multer.File>,
  ) {
    this.logger.log('completing inspection');
    // if (signatures.length < 1) {
    //   throw new BadRequestException(
    //     'signatures for customer and technician must be included',
    //   );
    // }

    // if (
    //   !signatures.find((f) => f.originalname === 'technician-signature.png') ||
    //   !signatures.find((f) => f.originalname === 'customer-signature.png')
    // ) {
    //   throw new BadRequestException(
    //     'signatures for customer and technician must be included',
    //   );
    // }

    return this.inspectionService.completeInspection(user, id, signatures);
  }

  @Post()
  create(
    @Body() createInspectionDto: CreateInspectionDto,
    @CurrentUser() user: User,
  ) {
    this.logger.log('creating inspection');
    return this.inspectionService.create(createInspectionDto, user);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    this.logger.log('get inspections');
    return this.inspectionService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    this.logger.log('get inspection by id');
    return this.inspectionService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInspectionDto: UpdateInspectionDto,
  ) {
    this.logger.log('update inspection');
    return this.inspectionService.update(+id, updateInspectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.logger.log('delete inspection');
    return this.inspectionService.remove(+id);
  }
}

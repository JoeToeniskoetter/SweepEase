import {
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
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { CurrentUser } from 'src/user/user.decorator';
import { User, UserRoles } from 'src/users/entities/user.entity';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { InspectionService } from './inspection.service';
import { Roles } from 'src/role/roles.decorator';

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

    return this.inspectionService.completeInspection(user, id, signatures);
  }

  @Roles([UserRoles.ADMIN, UserRoles.USER])
  @Post()
  create(
    @Body() createInspectionDto: CreateInspectionDto,
    @CurrentUser() user: User,
  ) {
    return this.inspectionService.create(createInspectionDto, user);
  }

  @Get()
  findAll(@CurrentUser() user: User, @Paginate() query: PaginateQuery) {
    return this.inspectionService.findAll(user, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.inspectionService.findOne(id, user);
  }

  @Roles([UserRoles.ADMIN, UserRoles.USER])
  @Patch(':id')
  update(
    @CurrentUser() currentUser: User,
    @Param('id') id: string,
    @Body() updateInspectionDto: UpdateInspectionDto,
  ) {
    return this.inspectionService.update(id, currentUser, updateInspectionDto);
  }

  @Roles([UserRoles.ADMIN, UserRoles.USER])
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.inspectionService.remove(id, user);
  }
}

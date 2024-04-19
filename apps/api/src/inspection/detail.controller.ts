import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/user/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { updateInspectionDetailItem } from './dto/update-inspection-detail-item';
import { InspectionService } from './inspection.service';

@Controller('inspection-details')
export class DetailController {
  constructor(private readonly inspectionService: InspectionService) {}

  @Get(':id')
  findInspectionDeatils(
    @Param('id') id: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.inspectionService.findInspectionDetails(id, currentUser);
  }

  @Post(':inspectionId/item/:itemId')
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
}

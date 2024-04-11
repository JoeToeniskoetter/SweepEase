import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
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

@UseGuards(FirebaseAuthGuard)
@Controller('inspection')
export class InspectionController {
  constructor(private readonly inspectionService: InspectionService) {}

  @Post('/start/:id')
  startInspection(@Param('id') id: string, @CurrentUser() user: User) {
    this.inspectionService.startInspection(id, user);
  }

  @Post('/details/:inspectionId/item/:itemId')
  updateInspectionDetailItem(
    @CurrentUser() user: User,
    @Param('inspectionId') inspectionId: string,
    @Param('itemId') itemId: string,
    @Body() body: updateInspectionDetailItem,
  ) {
    return this.inspectionService.updateInspectionDetailItem(
      inspectionId,
      itemId,
      body,
    );
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

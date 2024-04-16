import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/firebase/firebase.guard';
import { InspectionService } from './inspection.service';
import { CurrentUser } from 'src/user/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@UseGuards(FirebaseAuthGuard)
@Controller('inspection-templates')
export class TemplateController {
  logger = new Logger(TemplateController.name);
  constructor(private readonly inspectionService: InspectionService) {}

  @Get()
  findAllTemplates(@CurrentUser() currentUser: User) {
    this.logger.log('gettting templates');
    return this.inspectionService.findAllTemplates(currentUser);
  }

  @Get('options')
  findAllTemplateOptions(@CurrentUser() currentUser: User) {
    this.logger.log('gettting options');
    return this.inspectionService.findAllInspectionTemplateOptions(currentUser);
  }

  @Post()
  createInspectionTemplate(
    @Body() createTemplateDto: CreateTemplateDto,
    @CurrentUser() currentUser: User,
  ) {
    this.logger.log('create template');
    return this.inspectionService.createTemplate(
      createTemplateDto,
      currentUser,
    );
  }

  @Get(':id')
  findOneTemplate(@Param('id') id: string) {
    this.logger.log('getting templates by id');
    return this.inspectionService.findTemplateById(id);
  }

  @Patch(':id')
  updateTemplate(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ) {
    this.logger.log('updating template');
    return this.inspectionService.updateTemplate(id, updateTemplateDto, user);
  }

  @Delete(':id')
  deleteTemplate(@CurrentUser() user: User, @Param('id') id: string) {
    this.logger.log('deleting template');
    return this.inspectionService.deleteTemplate(id, user);
  }
}

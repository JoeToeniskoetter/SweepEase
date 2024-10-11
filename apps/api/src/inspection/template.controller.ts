import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CurrentUser } from 'src/user/user.decorator';
import { User, UserRoles } from 'src/users/entities/user.entity';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { InspectionService } from './inspection.service';
import { Roles } from 'src/role/roles.decorator';
import { CopyTemplateDto } from './dto/copy-template.dto';

@Controller('inspection-templates')
export class TemplateController {
  logger = new Logger(TemplateController.name);
  constructor(private readonly inspectionService: InspectionService) {}

  @Roles([UserRoles.USER, UserRoles.ADMIN, UserRoles.CREATOR])
  @Get()
  findAllTemplates(@CurrentUser() currentUser: User) {
    return this.inspectionService.findAllTemplates(currentUser);
  }

  @Get('options')
  findAllTemplateOptions(@CurrentUser() currentUser: User) {
    this.logger.log('gettting options');
    return this.inspectionService.findAllInspectionTemplateOptions(currentUser);
  }

  @Roles([UserRoles.ADMIN, UserRoles.CREATOR])
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

  @Roles([UserRoles.ADMIN, UserRoles.CREATOR])
  @Patch(':id')
  updateTemplate(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ) {
    this.logger.log('updating template');
    return this.inspectionService.updateTemplate(id, updateTemplateDto, user);
  }

  @Roles([UserRoles.ADMIN, UserRoles.CREATOR])
  @Delete(':id')
  deleteTemplate(@CurrentUser() user: User, @Param('id') id: string) {
    this.logger.log('deleting template');
    return this.inspectionService.deleteTemplate(id, user);
  }

  @Roles([UserRoles.ADMIN, UserRoles.CREATOR])
  @Post('/copy/:id')
  copyTemplate(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() copyTemplateDto: CopyTemplateDto,
  ) {
    this.logger.log('copying template');
    return this.inspectionService.copyTemplate(user, id, copyTemplateDto);
  }
}

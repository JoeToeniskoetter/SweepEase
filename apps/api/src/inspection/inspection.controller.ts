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

@UseGuards(FirebaseAuthGuard)
@Controller('inspection')
export class InspectionController {
  constructor(private readonly inspectionService: InspectionService) {}

  @Post()
  create(@Body() createInspectionDto: CreateInspectionDto) {
    return this.inspectionService.create(createInspectionDto);
  }

  @Get()
  findAll() {
    return this.inspectionService.findAll();
  }

  @Get('/templates')
  findAllTemplates(@CurrentUser() currentUser: User) {
    return this.inspectionService.findAllTemplates(currentUser);
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
  findOne(@Param('id') id: string) {
    return this.inspectionService.findOne(+id);
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

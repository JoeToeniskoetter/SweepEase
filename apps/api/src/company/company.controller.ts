import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  FileTypeValidator,
  ParseFilePipe,
  UploadedFile,
  Get,
  Param,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CurrentUser } from 'src/user/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @UseInterceptors(FileInterceptor('logo'))
  create(
    @Body() createCompanyDto: CreateCompanyDto,
    @CurrentUser() user: User,
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
    logo: Express.Multer.File,
  ) {
    return this.companyService.create(createCompanyDto, user, logo);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.companyService.findOneForUser(user, id);
  }
}

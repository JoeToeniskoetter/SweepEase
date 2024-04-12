import { Module } from '@nestjs/common';
import { InspectionService } from './inspection.service';
import { InspectionController } from './inspection.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InspectionTemplate } from './entities/inspection_template.entity';
import { InspectionTemplateItem } from './entities/inspection_template_items.entity';
import { InspectionTemplateOptions } from './entities/inspection_template_options.entity';
import { Inspection } from './entities/inspection.entity';
import { InspectionDetail } from './entities/inspection_detail.entity';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InspectionTemplate,
      InspectionTemplateItem,
      InspectionTemplateOptions,
      Inspection,
      InspectionDetail,
    ]),
    UploadModule,
  ],
  controllers: [InspectionController],
  providers: [InspectionService],
})
export class InspectionModule {}

import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { InspectionLevel } from '../entities/inspection_template.entity';

export class CreateTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(InspectionLevel, { each: true })
  inspectionLevel: string;
}

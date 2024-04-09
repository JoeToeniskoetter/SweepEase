import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(['Level 1', 'Level 2', 'Level 3'])
  inspectionLevel: string;
}

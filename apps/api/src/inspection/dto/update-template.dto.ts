import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  registerDecorator,
  ValidateNested,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { InspectionLevel } from '../entities/inspection_template.entity';

export function IsNonPrimitiveArray(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsNonPrimitiveArray',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(value: any, _args: ValidationArguments) {
          return (
            Array.isArray(value) &&
            value.reduce(
              (a, b) => a && typeof b === 'object' && !Array.isArray(b),
              true,
            )
          );
        },
      },
    });
  };
}

export class UpdateTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(InspectionLevel, { each: true })
  inspectionLevel: string;

  @IsBoolean()
  signaturesRequired: boolean;

  @ValidateNested({ each: true })
  @IsNonPrimitiveArray()
  @Type(() => InspectionTemplateSectionDto)
  items: InspectionTemplateSectionDto[];
}

export class InspectionTemplateSectionDto {
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  position: number;

  @ValidateNested({ each: true })
  @IsNonPrimitiveArray()
  @Type(() => InspectionTemplateSectionOptionDto)
  options: InspectionTemplateSectionOptionDto[];
}

export class InspectionTemplateSectionOptionDto {
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

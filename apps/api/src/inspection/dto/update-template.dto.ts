import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  registerDecorator,
  ValidateNested,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

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

  @IsEnum(['Level 1', 'Level 2', 'Level 3'])
  @IsString()
  @IsNotEmpty()
  inspectionLevel: string;

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

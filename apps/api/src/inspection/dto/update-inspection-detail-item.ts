import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class Condition {
  @IsString()
  name: string;

  @IsString()
  description: string;
}

export class updateInspectionDetailItem {
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  item: string;

  @IsObject()
  @ValidateNested()
  @Type(() => Condition)
  condition: Condition;

  @IsString()
  notes: string;
}

/**
 * {
api:dev:     id: '1f325f26-0fc2-4078-bc89-610926d951a2',
api:dev:     item: 'Flu Liner',
api:dev:     options: [ [Object], [Object], [Object] ],
api:dev:     condition: 'Not applicable',
api:dev:     notes: 'asdfasdf',
api:dev:     photoUrl: '',
api:dev:     isComplete: false,
api:dev:     createdAt: '2024-04-11T20:55:11.511Z',
api:dev:     updatedAt: '2024-04-11T20:55:11.511Z'
api:dev:   }
 */

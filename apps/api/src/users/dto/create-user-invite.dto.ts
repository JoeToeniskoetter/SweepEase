import { IsString } from 'class-validator';

export class CreateUserInviteDto {
  @IsString()
  email: string;
}
